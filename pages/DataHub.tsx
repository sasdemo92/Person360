import React from 'react';
import { useData } from '../context/DataContext';
import { Upload, FileText, Database, CheckCircle, Play } from 'lucide-react';

export const DataHub: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { 
    civilData, businessData, vehicleData, housingData, 
    uploadData, loadSampleData, startResolution, 
    isResolving, resolveProgress, resolveStep, people, t 
  } = useData();

  const FileCard = ({ title, count, type, data }: { title: string, count: number, type: string, data: any[] }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${data.length > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {data.length > 0 ? <CheckCircle size={20} /> : <FileText size={20} />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-1">
              {data.length > 0 ? `${data.length} ${t('dh_records_loaded')}` : t('dh_no_data')}
            </p>
          </div>
        </div>
      </div>
      
      {data.length === 0 ? (
        <label className="cursor-pointer block">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors bg-slate-50">
            <Upload size={20} className="mb-2" />
            <span className="text-xs font-medium">{t('dh_upload_csv')}</span>
          </div>
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            onChange={(e) => {
              if(e.target.files?.[0]) uploadData(type as any, e.target.files[0]);
            }} 
          />
        </label>
      ) : (
        <div className="space-y-2">
            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                <span className="font-mono text-slate-400 mr-2 rtl:ml-2 rtl:mr-0">{t('dh_join_key')}</span>
                <span className="font-semibold text-blue-700">residency_id</span>
            </div>
            <button className="text-xs text-blue-600 font-medium hover:underline w-full text-left rtl:text-right">
                {t('dh_view_preview')}
            </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">{t('dh_title')}</h1>
        <p className="text-slate-500 mt-1">{t('dh_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FileCard title={t('dh_card_civil')} count={civilData.length} type="civil" data={civilData} />
        <FileCard title={t('dh_card_business')} count={businessData.length} type="business" data={businessData} />
        <FileCard title={t('dh_card_vehicle')} count={vehicleData.length} type="vehicle" data={vehicleData} />
        <FileCard title={t('dh_card_housing')} count={housingData.length} type="housing" data={housingData} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h3 className="font-semibold text-navy-900">{t('dh_res_engine')}</h3>
           <p className="text-sm text-slate-500">{t('dh_res_desc').replace('{count}', (civilData.length + businessData.length + vehicleData.length + housingData.length).toString())}</p>
        </div>
        
        <div className="flex gap-4">
             <button 
                onClick={loadSampleData}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                disabled={isResolving}
             >
                {t('dh_load_sample')}
             </button>
             <button 
                onClick={startResolution}
                disabled={isResolving || civilData.length === 0}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium shadow-lg transition-all
                    ${isResolving || civilData.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-navy-800 hover:bg-navy-900 hover:shadow-xl'}
                `}
             >
                {isResolving ? (
                    <>{t('dh_processing')}</>
                ) : (
                    <><Play size={18} fill="currentColor" /> {t('dh_resolve_btn')}</>
                )}
             </button>
        </div>
      </div>

      {isResolving && (
        <div className="mt-8 bg-white p-8 rounded-xl border border-slate-200 shadow-lg max-w-2xl mx-auto">
             <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                 <span>{resolveStep}</span>
                 <span>{resolveProgress}%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden" dir="ltr">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${resolveProgress}%` }}
                ></div>
             </div>
        </div>
      )}

      {!isResolving && people.length > 0 && (
         <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-700">
                    <Database size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-green-900">{t('dh_complete_title')}</h3>
                    <p className="text-green-800 text-sm">{t('dh_complete_desc')}</p>
                    <div className="flex gap-4 mt-2 text-xs text-green-700">
                        <span>• {people.filter(p => p.flags.length > 0).length} {t('dh_high_risk')}</span>
                        <span>• {civilData.length} {t('dh_identities')}</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onComplete}
                className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium text-sm shadow-md"
            >
                {t('dh_go_dir')}
            </button>
         </div>
      )}
    </div>
  );
};