import React from 'react';
import { useData } from '../context/DataContext';
import { MapPin, Mail, Phone, Calendar, AlertTriangle, ShieldCheck, ArrowLeft, Building, Car, Home, Clock } from 'lucide-react';

export const Person360: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { people, selectedPersonId, t } = useData();
  const person = people.find(p => p.residency_id === selectedPersonId);

  if (!person) return <div className="p-8">Person not found</div>;

  const mapFlag = (flag: string) => {
      if (flag === 'Suspended License') return t('flag_suspended');
      if (flag === 'Flagged Vehicle') return t('flag_vehicle');
      if (flag === 'Vehicle Impounded') return t('flag_impounded');
      if (flag === 'Address Mismatch') return t('flag_mismatch');
      if (flag === 'Multiple Assets') return t('flag_assets');
      return flag;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
       <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-navy-900 mb-6 text-sm font-medium transition-colors">
          <ArrowLeft size={16} className="rtl:rotate-180" /> {t('p360_back')}
       </button>

       {/* Header Card */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          {/* Reduced height from h-32 to h-20 to make the blue bar smaller (approx 20% visual weight above photo) */}
          <div className="h-20 bg-navy-800 relative">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          <div className="relative z-10 px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6">
             <img src={person.photo_url} className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-slate-200" alt="" />
             <div className="flex-1 mb-1">
                <div className="flex justify-between items-start">
                   <div>
                       <h1 className="text-3xl font-bold text-slate-900">{person.full_name_en}</h1>
                       <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                          <span className="font-mono">{person.residency_id}</span>
                          <span>•</span>
                          <span>{person.nationality}</span>
                          <span>•</span>
                          <span>{person.age} {t('p360_years_old')}</span>
                       </div>
                   </div>
                   <div className="flex gap-2">
                      {person.flags.map(f => (
                          <span key={f} className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 text-xs font-bold flex items-center gap-1">
                              <AlertTriangle size={12} /> {mapFlag(f)}
                          </span>
                      ))}
                      {person.flags.length === 0 && (
                          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold flex items-center gap-1">
                              <ShieldCheck size={12} /> {t('p360_low_risk')}
                          </span>
                      )}
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Main Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Identity */}
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t('p360_identity_card')}</h3>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs text-slate-400">{t('p360_fullname_ar')}</label>
                      <div className="font-medium text-slate-800 text-right">{person.full_name_ar}</div>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-700">
                      <Calendar size={16} className="text-slate-400" />
                      <span>{person.dob}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-700">
                      <Phone size={16} className="text-slate-400" />
                      <span>{person.phone}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-700">
                      <Mail size={16} className="text-slate-400" />
                      <span className="break-all">{person.email}</span>
                   </div>
                   <div className="flex items-start gap-3 text-sm text-slate-700 border-t border-slate-100 pt-3 mt-3">
                      <MapPin size={16} className="text-slate-400 mt-0.5" />
                      <div>
                          <div className="font-medium">{person.current_city}</div>
                          <div className="text-slate-500 text-xs">{person.current_address}</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* CENTER: Data Assets */}
          <div className="lg:col-span-6 space-y-6">
             
             {/* Business Card */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                   <Building size={18} className="text-navy-800" />
                   <h3 className="font-semibold text-slate-800">{t('p360_businesses')}</h3>
                   <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{person.businesses.length}</span>
                </div>
                {person.businesses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right">
                            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 font-medium">{t('th_name')}</th>
                                    <th className="px-4 py-3 font-medium">{t('th_license')}</th>
                                    <th className="px-4 py-3 font-medium">{t('th_status')}</th>
                                    <th className="px-4 py-3 font-medium">{t('th_expiry')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {person.businesses.map(b => (
                                    <tr key={b.business_id}>
                                        <td className="px-4 py-3 font-medium text-slate-800">{b.business_name}</td>
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{b.license_number}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                b.license_status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}>{b.license_status}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{b.expiry_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 text-center text-slate-400 text-sm">{t('p360_no_business')}</div>
                )}
             </div>

             {/* Vehicles Card */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                   <Car size={18} className="text-navy-800" />
                   <h3 className="font-semibold text-slate-800">{t('p360_vehicles')}</h3>
                   <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{person.vehicles.length}</span>
                </div>
                {person.vehicles.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right">
                            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 font-medium">{t('th_plate')}</th>
                                    <th className="px-4 py-3 font-medium">{t('th_vehicle')}</th>
                                    <th className="px-4 py-3 font-medium">{t('th_status')}</th>
                                    <th className="px-4 py-3 font-medium">{t('th_reg_date')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {person.vehicles.map(v => (
                                    <tr key={v.vehicle_id}>
                                        <td className="px-4 py-3 font-mono font-bold text-slate-800 bg-slate-50 w-24 text-center border-r border-slate-100 rtl:border-r-0 rtl:border-l">{v.plate_number}</td>
                                        <td className="px-4 py-3 text-slate-700">{v.year} {v.make} {v.model}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                v.vehicle_status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}>{v.vehicle_status}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{v.registration_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 text-center text-slate-400 text-sm">{t('p360_no_vehicle')}</div>
                )}
             </div>

             {/* Housing Card */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                   <Home size={18} className="text-navy-800" />
                   <h3 className="font-semibold text-slate-800">{t('p360_housing')}</h3>
                   <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{person.housing.length}</span>
                </div>
                {person.housing.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {person.housing.map(h => (
                            <div key={h.property_id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                <div>
                                    <div className="font-medium text-slate-800 flex items-center gap-2">
                                        {h.property_type} 
                                        <span className="text-xs font-normal text-slate-400">({h.ownership_type})</span>
                                    </div>
                                    <div className="text-xs text-slate-500">{h.address}, {h.city}</div>
                                </div>
                                <div className="text-right text-xs text-slate-500 rtl:text-left">
                                    <div>Since: {h.move_in_date}</div>
                                    {h.move_out_date && <div className="text-red-400">Moved out: {h.move_out_date}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-slate-400 text-sm">{t('p360_no_housing')}</div>
                )}
             </div>

          </div>

          {/* RIGHT: Insights */}
          <div className="lg:col-span-3 space-y-6">
             
             <div className="bg-navy-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 rtl:right-auto rtl:left-0">
                    <ShieldCheck size={100} />
                </div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    {t('p360_insights')}
                </h3>
                <ul className="space-y-3 text-sm text-slate-300 relative z-10">
                    <li className="flex gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Individual holds {person.businesses.length + person.vehicles.length + person.housing.length} registered assets across {new Set([...person.businesses.map(b=>b.business_city), ...person.vehicles.map(v=>v.registered_city), ...person.housing.map(h=>h.city)]).size} jurisdictions.</span>
                    </li>
                    {person.flags.includes('Address Mismatch') && (
                        <li className="flex gap-2">
                            <span className="text-red-400">•</span>
                            <span><span className="text-white font-medium">Discrepancy detected:</span> Registered housing location differs from Civil ID city.</span>
                        </li>
                    )}
                     {person.flags.includes('Suspended License') && (
                        <li className="flex gap-2">
                            <span className="text-red-400">•</span>
                            <span><span className="text-white font-medium">Risk Alert:</span> Associated business license is currently SUSPENDED.</span>
                        </li>
                    )}
                    <li className="flex gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Primary residence appears to be {person.current_city}.</span>
                    </li>
                </ul>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock size={16} /> {t('p360_timeline')}
                </h3>
                <div className="relative border-l border-slate-200 ml-2 space-y-6 pl-4 pb-2 rtl:border-l-0 rtl:border-r rtl:mr-2 rtl:ml-0 rtl:pr-4 rtl:pl-0">
                    {/* Mock timeline logic - simply taking a few dates */}
                    {[
                        ...person.vehicles.map(v => ({ date: v.registration_date, label: `Vehicle Reg: ${v.plate_number}`, type: 'vehicle' })),
                        ...person.businesses.map(b => ({ date: b.issue_date, label: `License Issued: ${b.license_number}`, type: 'business' })),
                        ...person.housing.map(h => ({ date: h.move_in_date, label: `Moved In: ${h.property_type}`, type: 'housing' }))
                    ].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 5).map((event, idx) => (
                        <div key={idx} className="relative">
                             <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-white shadow-sm rtl:-right-[21px] rtl:left-auto ${
                                 event.type === 'vehicle' ? 'bg-blue-500' : event.type === 'business' ? 'bg-purple-500' : 'bg-orange-500'
                             }`}></div>
                             <div className="text-xs text-slate-400 mb-0.5">{event.date}</div>
                             <div className="text-sm font-medium text-slate-700">{event.label}</div>
                        </div>
                    ))}
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};