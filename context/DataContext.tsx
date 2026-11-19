import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CivilRecord, BusinessRecord, VehicleRecord, HousingRecord, PersonProfile } from '../types';
import { parseCSV } from '../utils/csvParser';

interface DataContextType {
  civilData: CivilRecord[];
  businessData: BusinessRecord[];
  vehicleData: VehicleRecord[];
  housingData: HousingRecord[];
  people: PersonProfile[];
  isResolving: boolean;
  resolveProgress: number;
  resolveStep: string;
  uploadData: (type: 'civil' | 'business' | 'vehicle' | 'housing', file: File) => Promise<void>;
  loadSampleData: () => void;
  startResolution: () => Promise<void>;
  selectedPersonId: string | null;
  setSelectedPersonId: (id: string | null) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- TRANSLATIONS ---
const translations: Record<string, Record<string, string>> = {
  en: {
    nav_data_hub: "Data Hub",
    nav_directory: "People Directory",
    nav_person_360: "Person 360",
    
    // Data Hub
    dh_title: "Unified Person Intelligence",
    dh_subtitle: "Ingest disparate datasets, resolve identities, and build a Single Source of Truth.",
    dh_card_civil: "Civil Identity (Registry)",
    dh_card_business: "Business Licenses",
    dh_card_vehicle: "Registered Vehicles",
    dh_card_housing: "Housing & Properties",
    dh_upload_csv: "Upload CSV",
    dh_records_loaded: "Records Loaded",
    dh_no_data: "No Data",
    dh_join_key: "JOIN KEY:",
    dh_view_preview: "View Preview (20 rows)",
    dh_res_engine: "Resolution Engine",
    dh_res_desc: "Ready to normalize and link records across domains.",
    dh_load_sample: "Load Sample Data",
    dh_resolve_btn: "Resolve & Build",
    dh_processing: "Processing...",
    dh_complete_title: "Resolution Complete",
    dh_complete_desc: "Successfully built unified profiles.",
    dh_high_risk: "High Risk Profiles",
    dh_identities: "Identities Verified",
    dh_go_dir: "Go to People Directory",

    // Directory
    dir_title: "People Directory",
    dir_subtitle: "Single Source of Truth (SSOT)",
    dir_spotlight: "Spotlight:",
    dir_search_placeholder: "Search by name, ID, license, or phone...",
    dir_filters: "Filters",
    tbl_identity: "Identity",
    tbl_residency: "Residency ID",
    tbl_nationality: "Nationality",
    tbl_age: "Age",
    tbl_assets: "Assets",
    tbl_flags: "Flags",
    tbl_confidence: "Confidence",
    tbl_clean: "Clean",
    tbl_no_records: "No records found matching",

    // Person 360
    p360_back: "Back to Directory",
    p360_years_old: "Years Old",
    p360_low_risk: "Low Risk",
    p360_identity_card: "Identity & Contact",
    p360_fullname_ar: "Full Name (AR)",
    p360_businesses: "Businesses & Licenses",
    p360_vehicles: "Vehicles",
    p360_housing: "Housing & Properties",
    p360_insights: "AI Insights",
    p360_timeline: "Activity Timeline",
    p360_no_business: "No business records found.",
    p360_no_vehicle: "No vehicle records found.",
    p360_no_housing: "No housing records found.",
    
    // Table Headers Person 360
    th_name: "Name",
    th_license: "License #",
    th_status: "Status",
    th_expiry: "Expiry",
    th_plate: "Plate",
    th_vehicle: "Vehicle",
    th_reg_date: "Reg. Date",

    // Copilot
    cp_title: "Intelligence Copilot",
    cp_genai: "GenAI Powered",
    cp_placeholder: "Ask a question...",
    cp_btn_summarize: "Summarize",
    cp_btn_risks: "Check Risks",
    cp_btn_inconsistencies: "Inconsistencies",
    cp_greeting: "Officer, I am ready to assist. You can ask me to summarize profiles, cross-check assets, or draft briefs.",
    
    // Flags
    flag_suspended: "Suspended License",
    flag_vehicle: "Flagged Vehicle",
    flag_impounded: "Vehicle Impounded",
    flag_mismatch: "Address Mismatch",
    flag_assets: "Multiple Assets"
  },
  ar: {
    nav_data_hub: "مركز البيانات",
    nav_directory: "دليل الأشخاص",
    nav_person_360: "ملف ٣٦٠",
    
    // Data Hub
    dh_title: "استخبارات الأفراد الموحدة",
    dh_subtitle: "استيعاب مجموعات البيانات المختلفة، وحل الهويات، وبناء مصدر واحد للحقيقة.",
    dh_card_civil: "الهوية المدنية (السجل)",
    dh_card_business: "الرخص التجارية",
    dh_card_vehicle: "المركبات المسجلة",
    dh_card_housing: "الإسكان والعقارات",
    dh_upload_csv: "رفع ملف CSV",
    dh_records_loaded: "سجلات تم تحميلها",
    dh_no_data: "لا توجد بيانات",
    dh_join_key: "مفتاح الربط:",
    dh_view_preview: "معاينة (٢٠ صف)",
    dh_res_engine: "محرك المعالجة",
    dh_res_desc: "جاهز لتوحيد وربط السجلات عبر النطاقات.",
    dh_load_sample: "تحميل بيانات تجريبية",
    dh_resolve_btn: "معالجة وبناء",
    dh_processing: "جارِ المعالجة...",
    dh_complete_title: "اكتملت المعالجة",
    dh_complete_desc: "تم بناء الملفات الموحدة بنجاح.",
    dh_high_risk: "ملفات عالية المخاطر",
    dh_identities: "هويات تم التحقق منها",
    dh_go_dir: "الذهاب إلى دليل الأشخاص",

    // Directory
    dir_title: "دليل الأشخاص",
    dir_subtitle: "المصدر الوحيد للحقيقة (SSOT)",
    dir_spotlight: "تسليط الضوء:",
    dir_search_placeholder: "البحث بالاسم، الهوية، الرخصة، أو الهاتف...",
    dir_filters: "تصفية",
    tbl_identity: "الهوية",
    tbl_residency: "رقم الإقامة",
    tbl_nationality: "الجنسية",
    tbl_age: "العمر",
    tbl_assets: "الأصول",
    tbl_flags: "تنبيهات",
    tbl_confidence: "الثقة",
    tbl_clean: "سليم",
    tbl_no_records: "لا توجد سجلات تطابق",

    // Person 360
    p360_back: "العودة للدليل",
    p360_years_old: "سنة",
    p360_low_risk: "مخاطر منخفضة",
    p360_identity_card: "الهوية والاتصال",
    p360_fullname_ar: "الاسم الكامل (عربي)",
    p360_businesses: "الأعمال والرخص",
    p360_vehicles: "المركبات",
    p360_housing: "الإسكان والعقارات",
    p360_insights: "تحليلات الذكاء الاصطناعي",
    p360_timeline: "الجدول الزمني للنشاط",
    p360_no_business: "لا توجد سجلات تجارية.",
    p360_no_vehicle: "لا توجد سجلات مركبات.",
    p360_no_housing: "لا توجد سجلات سكنية.",

    // Table Headers Person 360
    th_name: "الاسم",
    th_license: "رقم الرخصة",
    th_status: "الحالة",
    th_expiry: "الانتهاء",
    th_plate: "اللوحة",
    th_vehicle: "المركبة",
    th_reg_date: "تاريخ التسجيل",

    // Copilot
    cp_title: "المساعد الذكي",
    cp_genai: "مدعوم بالذكاء الاصطناعي",
    cp_placeholder: "اطرح سؤالاً...",
    cp_btn_summarize: "تلخيص",
    cp_btn_risks: "فحص المخاطر",
    cp_btn_inconsistencies: "التناقضات",
    cp_greeting: "أهلاً بك أيها الضابط. أنا جاهز للمساعدة. يمكنك أن تطلب مني تلخيص الملفات، أو فحص الأصول، أو صياغة التقارير.",

    // Flags
    flag_suspended: "رخصة معلقة",
    flag_vehicle: "مركبة مطلوبة",
    flag_impounded: "مركبة محجوزة",
    flag_mismatch: "اختلاف العنوان",
    flag_assets: "أصول متعددة"
  }
};

// --- SAMPLE DATA CONSTANTS ---
const SAMPLE_CIVIL = `residency_id,full_name_en,full_name_ar,dob,gender,nationality,phone,email,current_city,current_address,photo_url
OMR-2026-0007,Ahmed Al-Said,أحمد آل سعيد,1985-04-12,Male,Omani,+968 99123456,ahmed.said@example.com,Muscat,Villa 12, Way 4001,https://picsum.photos/id/1005/200/200
OMR-2026-0031,Sarah Jones,سارة جونز,1992-08-23,Female,British,+968 77654321,s.jones@tech.om,Seeb,Apt 4B, Al Mouj,https://picsum.photos/id/64/200/200
OMR-2026-0105,Khalid Al-Harthy,خالد الحارثي,1978-11-05,Male,Omani,+968 99887766,k.harthy@trading.co,Salalah,Farm Road 5,https://picsum.photos/id/91/200/200
OMR-2026-0999,John Doe,جون دو,1990-01-01,Male,American,+968 91111111,j.doe@ghost.com,Sohar,Unknown,https://picsum.photos/id/30/200/200`;

const SAMPLE_BUSINESS = `residency_id,business_id,business_name,license_number,license_type,issue_date,expiry_date,license_status,business_city,employees_est
OMR-2026-0007,BUS-101,Al-Said Trading,LIC-998877,Import/Export,2020-01-15,2025-01-15,Active,Muscat,12
OMR-2026-0007,BUS-102,Muscat Cafes,LIC-554433,Food & Beverage,2022-06-10,2023-06-10,Expired,Muscat,5
OMR-2026-0105,BUS-201,Salalah Logistics,LIC-112233,Logistics,2019-03-20,2024-03-20,Suspended,Salalah,45`;

const SAMPLE_VEHICLES = `residency_id,vehicle_id,plate_number,make,model,year,color,vehicle_status,registered_city,registration_date
OMR-2026-0007,VEH-001,9921-BB,Toyota,Land Cruiser,2023,White,Active,Muscat,2023-02-01
OMR-2026-0007,VEH-002,1001-AA,Lexus,LX570,2021,Black,Active,Muscat,2021-05-15
OMR-2026-0031,VEH-003,5544-RR,Mini,Cooper,2020,Red,Flagged,Seeb,2020-08-20
OMR-2026-0105,VEH-004,8877-XY,Nissan,Patrol,2018,Gold,Impounded,Salalah,2018-11-30`;

const SAMPLE_HOUSING = `residency_id,property_id,property_type,ownership_type,city,address,move_in_date,move_out_date
OMR-2026-0007,PROP-01,Villa,Owned,Muscat,Way 4001,2015-06-01,
OMR-2026-0031,PROP-02,Apartment,Rented,Seeb,Al Mouj St,2021-01-10,
OMR-2026-0105,PROP-03,Villa,Owned,Muscat,Qurum Heights,2010-01-01,2018-12-31
OMR-2026-0105,PROP-04,Townhouse,Owned,Salalah,Dahariz Beach,2019-01-01,`;

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [civilData, setCivilData] = useState<CivilRecord[]>([]);
  const [businessData, setBusinessData] = useState<BusinessRecord[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleRecord[]>([]);
  const [housingData, setHousingData] = useState<HousingRecord[]>([]);
  const [people, setPeople] = useState<PersonProfile[]>([]);
  
  const [isResolving, setIsResolving] = useState(false);
  const [resolveProgress, setResolveProgress] = useState(0);
  const [resolveStep, setResolveStep] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const uploadData = async (type: string, file: File) => {
    const text = await file.text();
    const parsed = parseCSV(text);
    if (type === 'civil') setCivilData(parsed as CivilRecord[]);
    if (type === 'business') setBusinessData(parsed as BusinessRecord[]);
    if (type === 'vehicle') setVehicleData(parsed as VehicleRecord[]);
    if (type === 'housing') setHousingData(parsed as HousingRecord[]);
  };

  const loadSampleData = () => {
    setCivilData(parseCSV<CivilRecord>(SAMPLE_CIVIL));
    setBusinessData(parseCSV<BusinessRecord>(SAMPLE_BUSINESS));
    setVehicleData(parseCSV<VehicleRecord>(SAMPLE_VEHICLES));
    setHousingData(parseCSV<HousingRecord>(SAMPLE_HOUSING));
  };

  const startResolution = async () => {
    if (civilData.length === 0) return;
    setIsResolving(true);
    setResolveProgress(0);
    
    // Step 1: Validate
    setResolveStep("Validating Schemas...");
    await new Promise(r => setTimeout(r, 800));
    setResolveProgress(25);

    // Step 2: Normalize
    setResolveStep("Normalizing Keys...");
    await new Promise(r => setTimeout(r, 800));
    setResolveProgress(50);

    // Step 3: Match
    setResolveStep("Matching Identities (Residency ID)...");
    await new Promise(r => setTimeout(r, 800));
    setResolveProgress(75);

    // Step 4: Build SSOT
    setResolveStep("Generating Single Source of Truth...");
    
    const resolvedPeople: PersonProfile[] = civilData.map(person => {
      const businesses = businessData.filter(b => b.residency_id === person.residency_id);
      const vehicles = vehicleData.filter(v => v.residency_id === person.residency_id);
      const housing = housingData.filter(h => h.residency_id === person.residency_id);

      // Calc Age
      const birthYear = new Date(person.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      // Flags Logic
      const flags: string[] = [];
      if (businesses.some(b => b.license_status === 'Suspended')) flags.push('Suspended License');
      if (vehicles.some(v => v.vehicle_status === 'Flagged')) flags.push('Flagged Vehicle');
      if (vehicles.some(v => v.vehicle_status === 'Impounded')) flags.push('Vehicle Impounded');
      
      const distinctCities = new Set(housing.map(h => h.city));
      // Simple address mismatch logic: if they have housing in a city that is NOT their current_city
      const hasMismatch = housing.some(h => h.city !== person.current_city && !h.move_out_date);
      if (hasMismatch) flags.push('Address Mismatch');

      if ((businesses.length + vehicles.length + housing.length) >= 5) flags.push('Multiple Assets');

      return {
        ...person,
        age,
        businesses,
        vehicles,
        housing,
        flags,
        matchConfidence: 100
      };
    });

    setPeople(resolvedPeople);
    setResolveProgress(100);
    setResolveStep("Complete");
    await new Promise(r => setTimeout(r, 500));
    setIsResolving(false);
  };

  return (
    <DataContext.Provider value={{
      civilData, businessData, vehicleData, housingData, people,
      isResolving, resolveProgress, resolveStep,
      uploadData, loadSampleData, startResolution,
      selectedPersonId, setSelectedPersonId,
      language, setLanguage, t
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};