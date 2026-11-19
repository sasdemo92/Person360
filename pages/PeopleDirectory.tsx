import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Search, Filter, ChevronRight, AlertOctagon, Car, Building, Briefcase } from 'lucide-react';

interface Props {
  onSelectPerson: (id: string) => void;
}

export const PeopleDirectory: React.FC<Props> = ({ onSelectPerson }) => {
  const { people, t } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPeople = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return people.filter(p => 
      p.full_name_en.toLowerCase().includes(lower) || 
      p.residency_id.toLowerCase().includes(lower) ||
      p.phone.includes(searchTerm) || 
      p.email.toLowerCase().includes(lower) ||
      p.businesses.some(b => b.business_name.toLowerCase().includes(lower))
    );
  }, [people, searchTerm]);

  const mapFlag = (flag: string) => {
      if (flag === 'Suspended License') return t('flag_suspended');
      if (flag === 'Flagged Vehicle') return t('flag_vehicle');
      if (flag === 'Vehicle Impounded') return t('flag_impounded');
      if (flag === 'Address Mismatch') return t('flag_mismatch');
      if (flag === 'Multiple Assets') return t('flag_assets');
      return flag;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
       {/* Header & Spotlight */}
       <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">{t('dir_title')}</h1>
            <p className="text-slate-500 text-sm">{t('dir_subtitle')} • {people.length} Records</p>
          </div>
          
          <div className="flex gap-2">
             <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 flex items-center gap-2">
                <span className="uppercase tracking-wider">{t('dir_spotlight')}</span>
                <button onClick={() => onSelectPerson('OMR-2026-0007')} className="text-blue-600 hover:underline">OMR-2026-0007</button>
                <span className="text-slate-300">|</span>
                <button onClick={() => onSelectPerson('OMR-2026-0031')} className="text-blue-600 hover:underline">OMR-2026-0031</button>
             </div>
          </div>
       </div>

       {/* Search & Filter Bar */}
       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-3 rtl:left-auto" size={18} />
             <input 
                type="text" 
                placeholder={t('dir_search_placeholder')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 rtl:pr-10 rtl:pl-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
             <Filter size={16} /> {t('dir_filters')}
          </button>
       </div>

       {/* Table */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm rtl:text-right">
             <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                   <th className="px-6 py-4">{t('tbl_identity')}</th>
                   <th className="px-6 py-4">{t('tbl_residency')}</th>
                   <th className="px-6 py-4">{t('tbl_nationality')}</th>
                   <th className="px-6 py-4 text-center">{t('tbl_age')}</th>
                   <th className="px-6 py-4 text-center">{t('tbl_assets')}</th>
                   <th className="px-6 py-4">{t('tbl_flags')}</th>
                   <th className="px-6 py-4 text-right rtl:text-left">{t('tbl_confidence')}</th>
                   <th className="px-6 py-4"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {filteredPeople.map((person) => (
                   <tr 
                     key={person.residency_id} 
                     onClick={() => onSelectPerson(person.residency_id)}
                     className="hover:bg-slate-50 cursor-pointer transition-colors group"
                   >
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <img src={person.photo_url} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                            <div>
                               <div className="font-semibold text-slate-900">{person.full_name_en}</div>
                               <div className="text-xs text-slate-500">{person.current_city}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">{person.residency_id}</td>
                      <td className="px-6 py-4 text-slate-600">{person.nationality}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{person.age}</td>
                      <td className="px-6 py-4">
                         <div className="flex justify-center gap-3">
                            <span className={`flex items-center gap-1 text-xs ${person.businesses.length ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                               <Briefcase size={14} /> {person.businesses.length}
                            </span>
                            <span className={`flex items-center gap-1 text-xs ${person.vehicles.length ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                               <Car size={14} /> {person.vehicles.length}
                            </span>
                            <span className={`flex items-center gap-1 text-xs ${person.housing.length ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                               <Building size={14} /> {person.housing.length}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-wrap gap-1">
                            {person.flags.length === 0 ? (
                                <span className="text-xs text-slate-400">{t('tbl_clean')}</span>
                            ) : (
                                person.flags.map(f => (
                                    <span key={f} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                        f.includes('Suspended') || f.includes('Impounded') 
                                        ? 'bg-red-50 text-red-700 border-red-100' 
                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        <AlertOctagon size={10} /> {mapFlag(f)}
                                    </span>
                                ))
                            )}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                         <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-100">
                             {person.matchConfidence}%
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left text-slate-300 group-hover:text-blue-600">
                         <ChevronRight size={18} className="rtl:rotate-180" />
                      </td>
                   </tr>
                ))}
                {filteredPeople.length === 0 && (
                    <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                            {t('tbl_no_records')} "{searchTerm}"
                        </td>
                    </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};