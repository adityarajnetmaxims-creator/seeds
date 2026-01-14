import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, X, MapPin, Phone, ChevronRight, Loader2, Mail, Languages, 
  ArrowLeft, Spade, Shovel, Droplets, Info, Leaf, BookOpen, 
  Sprout, LayoutGrid, ChevronLeft, Globe
} from 'lucide-react';
import { CATEGORIES, TRANSLATIONS, CULTIVATION_GUIDES } from './constants.tsx';
import { Language, Category, Crop, Product } from './types.ts';
import { getProductInsight } from './geminiService.ts';

// High-quality realistic image mapping for vegetables
const getCropImage = (cropId: string) => {
  const imageMap: Record<string, string> = {
    'onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=200&h=200&auto=format&fit=crop',
    'tomato': 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?q=80&w=200&h=200&auto=format&fit=crop',
    'hot-pepper': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=200&h=200&auto=format&fit=crop',
    'okra': 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?q=80&w=200&h=200&auto=format&fit=crop',
    'cucumber': 'https://images.unsplash.com/photo-1449339854873-750e6913301b?q=80&w=200&h=200&auto=format&fit=crop',
    'watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=200&h=200&auto=format&fit=crop',
    'pumpkin': 'https://images.unsplash.com/photo-1506867076193-81a1da0fdced?q=80&w=200&h=200&auto=format&fit=crop',
    'tinda': 'https://images.unsplash.com/photo-1596333522244-28ffb913718b?q=80&w=200&h=200&auto=format&fit=crop',
    'knol-khol': 'https://images.unsplash.com/photo-1590779033100-9f60705a2f3b?q=80&w=200&h=200&auto=format&fit=crop',
    'cabbage': 'https://images.unsplash.com/photo-1550142414-ad2626ad1327?q=80&w=200&h=200&auto=format&fit=crop',
    'bottle-gourd': 'https://images.unsplash.com/photo-1594282486512-ad58f62b754a?q=80&w=200&h=200&auto=format&fit=crop',
    'sponge-gourd': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?q=80&w=200&h=200&auto=format&fit=crop',
    'ridge-gourd': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?q=80&w=200&h=200&auto=format&fit=crop',
    'bitter-gourd': 'https://images.unsplash.com/photo-1596333522244-28ffb913718b?q=80&w=200&h=200&auto=format&fit=crop',
    'radish': 'https://images.unsplash.com/photo-1590779033100-9f60705a2f3b?q=80&w=200&h=200&auto=format&fit=crop',
    'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=200&h=200&auto=format&fit=crop',
    'beet-root': 'https://images.unsplash.com/photo-1439127989242-c3749a012eac?q=80&w=200&h=200&auto=format&fit=crop',
    'cowpea': 'https://images.unsplash.com/photo-1550142414-ad2626ad1327?q=80&w=200&h=200&auto=format&fit=crop',
    'french-beans': 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?q=80&w=200&h=200&auto=format&fit=crop',
    'coriander': 'https://images.unsplash.com/photo-1588877329975-b44a330148ec?q=80&w=200&h=200&auto=format&fit=crop',
    'palak': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=200&h=200&auto=format&fit=crop',
    'peas': 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=200&h=200&auto=format&fit=crop',
  };
  return imageMap[cropId] || 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=200&h=200&auto=format&fit=crop';
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<'search' | 'detail'>('search');
  const [step, setStep] = useState<'category' | 'crop' | 'product'>('category');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [selectedCropId, setSelectedCropId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const t = TRANSLATIONS[lang];

  const currentCategory = useMemo(() => CATEGORIES.find(c => c.id === selectedCatId), [selectedCatId]);
  const currentCrop = useMemo(() => currentCategory?.crops.find(c => c.id === selectedCropId), [currentCategory, selectedCropId]);
  const currentProduct = useMemo(() => currentCrop?.products.find(p => p.id === selectedProductId), [currentCrop, selectedProductId]);

  const handleSeeDetails = async (productId: string) => {
    const prod = currentCrop?.products.find(p => p.id === productId);
    if (currentCategory && currentCrop && prod) {
      setSelectedProductId(productId);
      setLoading(true);
      setInsight(null);
      const text = await getProductInsight(currentCategory.name, currentCrop.name, prod.name);
      setInsight(text || '');
      setLoading(false);
      setView('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToSearch = () => {
    setView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetSelection = () => {
    setStep('category');
    setSelectedCatId('');
    setSelectedCropId('');
    setSelectedProductId('');
  };

  const currentGuide = selectedCropId ? CULTIVATION_GUIDES[selectedCropId] : null;

  return (
    <div className="min-h-screen flex flex-col font-oswald tracking-wide bg-white">
      {/* Top Utility Bar */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 py-2 px-4 flex justify-between items-center relative z-[60]">
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 text-[#2d5a27] hover:text-[#8cc63f] transition-colors text-xs font-bold uppercase tracking-widest font-sans group">
             <BookOpen size={14} className="group-hover:scale-110 transition-transform" />
             <span className="border-b border-transparent group-hover:border-[#8cc63f]">My Catalog</span>
           </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-[#2d5a27] font-sans text-xs font-semibold">
            <Languages size={14} />
            <span>Language:</span>
          </div>
          <select 
            className="bg-transparent border-none rounded p-1 text-xs font-sans focus:ring-0 text-gray-700 cursor-pointer hover:text-[#2d5a27] transition-colors"
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToSearch}>
             <div className="w-10 h-10 bg-[#2d5a27] rounded-full flex items-center justify-center text-white font-bold text-xl italic border-2 border-[#8cc63f]">H</div>
             <div className="leading-none">
                <span className="text-[#2d5a27] font-bold text-xl block tracking-tighter uppercase">HIMALAYA</span>
                <span className="text-[#8cc63f] text-[10px] font-sans font-bold block uppercase tracking-tight">Hybrid Seeds</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
           >
             {isMenuOpen ? <X size={28} className="text-[#2d5a27]" /> : <Menu size={28} className="text-[#2d5a27]" />}
           </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 animate-slide-up shadow-2xl">
           <ul className="space-y-6 text-2xl font-bold text-[#2d5a27] uppercase">
             <li className="border-b border-gray-100 pb-2" onClick={() => { setIsMenuOpen(false); setView('search'); }}>{t.home}</li>
             <li className="border-b border-gray-100 pb-2 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
               <BookOpen size={24} />
               My Catalog
             </li>
             <li className="border-b border-gray-100 pb-2" onClick={() => setIsMenuOpen(false)}>{t.aboutUs}</li>
           </ul>
        </div>
      )}

      {view === 'search' ? (
        <>
          {/* Hero Section */}
          <section className="relative h-64 md:h-[380px] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=2000" 
              alt="Lush Vegetables" 
              className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
            />
            <div className="relative z-10 text-white animate-slide-up w-full max-w-4xl">
              <div className="h-1 w-12 bg-[#8cc63f] mx-auto mb-6 rounded-full"></div>
              <h1 className="text-3xl md:text-6xl font-bold mb-4 uppercase drop-shadow-lg tracking-tighter leading-tight">{t.findCatalog}</h1>
              <p className="text-sm md:text-xl max-w-2xl mx-auto opacity-90 font-sans tracking-normal font-light">
                {t.heroSubtitle}
              </p>
            </div>
          </section>

          {/* Visual Explorer Main Section */}
          <main className="flex-grow bg-gray-50 -mt-12 md:-mt-20 relative z-20 px-4 pb-20">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-[#2d5a27]">
              
              {/* Breadcrumbs Navigation */}
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button 
                  onClick={resetSelection}
                  className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${step === 'category' ? 'text-[#2d5a27]' : 'text-gray-400'}`}
                >
                  <LayoutGrid size={14} /> Explore
                </button>
                {selectedCatId && (
                  <>
                    <ChevronRight size={14} className="text-gray-300" />
                    <button 
                      onClick={() => { setStep('crop'); setSelectedCropId(''); }}
                      className={`text-xs font-bold uppercase tracking-widest ${step === 'crop' ? 'text-[#2d5a27]' : 'text-gray-400'}`}
                    >
                      {currentCategory?.name}
                    </button>
                  </>
                )}
                {selectedCropId && (
                  <>
                    <ChevronRight size={14} className="text-gray-300" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#2d5a27]">
                      {currentCrop?.name}
                    </span>
                  </>
                )}
              </div>

              <div className="p-6 md:p-10">
                {/* STEP 1: Select Category */}
                {step === 'category' && (
                  <div className="animate-slide-up">
                    <h2 className="text-2xl font-bold text-[#2d5a27] mb-8 uppercase text-center">What are you looking for?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCatId(cat.id); setStep('crop'); }}
                          className="flex items-center justify-between p-6 rounded-xl border-2 border-gray-100 hover:border-[#8cc63f] hover:bg-[#f0f9eb] transition-all group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#f0f9eb] flex items-center justify-center text-[#2d5a27] group-hover:bg-[#2d5a27] group-hover:text-white transition-colors">
                                {cat.id === 'veg' ? <Leaf size={24} /> : <Sprout size={24} />}
                            </div>
                            <span className="text-xl font-bold text-gray-800 uppercase">{cat.name}</span>
                          </div>
                          <ChevronRight className="text-gray-300 group-hover:text-[#2d5a27]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Select Crop */}
                {step === 'crop' && (
                  <div className="animate-slide-up">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-2xl font-bold text-[#2d5a27] uppercase">Select Your Crop</h2>
                       <button onClick={resetSelection} className="text-xs font-bold text-[#8cc63f] uppercase tracking-widest flex items-center gap-1">
                          <ChevronLeft size={14} /> Back
                       </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {currentCategory?.crops.map(crop => (
                        <button
                          key={crop.id}
                          onClick={() => { setSelectedCropId(crop.id); setStep('product'); }}
                          className="flex flex-col items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#8cc63f] hover:shadow-xl transition-all group bg-white"
                        >
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-[#f0f9eb] flex items-center justify-center relative">
                             <img 
                                src={getCropImage(crop.id)} 
                                alt={crop.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                             />
                             <div className="absolute inset-0 bg-[#2d5a27]/5 group-hover:bg-transparent transition-colors"></div>
                          </div>
                          <span className="text-sm font-bold text-gray-700 text-center uppercase tracking-tight line-clamp-2 leading-tight h-8 flex items-center">{crop.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Select Product */}
                {step === 'product' && (
                  <div className="animate-slide-up">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-2xl font-bold text-[#2d5a27] uppercase">{currentCrop?.name} Varieties</h2>
                       <button onClick={() => setStep('crop')} className="text-xs font-bold text-[#8cc63f] uppercase tracking-widest flex items-center gap-1">
                          <ChevronLeft size={14} /> Back
                       </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentCrop?.products.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleSeeDetails(product.id)}
                          className="flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-[#2d5a27] hover:bg-gray-50 transition-all group relative overflow-hidden"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#8cc63f] uppercase tracking-widest mb-1">Hybrid Series</span>
                            <span className="text-xl font-bold text-[#2d5a27] uppercase">{product.name}</span>
                          </div>
                          <div className="bg-[#2d5a27] p-2 rounded-full text-white group-hover:scale-110 transition-transform">
                             {loading && selectedProductId === product.id ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {currentGuide && (
                      <div className="mt-12 p-6 bg-[#f0f9eb] rounded-2xl border-2 border-[#8cc63f]/20 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Info className="text-[#2d5a27]" />
                            <div>
                               <p className="text-[#2d5a27] font-bold uppercase text-sm">Need Cultivation Help?</p>
                               <p className="text-gray-600 font-sans text-xs">Access our expert {currentCrop?.name} guide below.</p>
                            </div>
                         </div>
                         <Spade className="text-[#2d5a27]/20" size={32} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </>
      ) : (
        /* DETAIL PAGE VIEW */
        <main className="flex-grow animate-slide-up pb-20">
          <header className="bg-[#2d5a27] text-white pt-10 pb-20 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
              <button 
                onClick={handleBackToSearch}
                className="flex items-center gap-2 text-[#8cc63f] font-sans font-bold mb-8 hover:translate-x-[-4px] transition-transform uppercase text-xs tracking-widest"
              >
                <ArrowLeft size={18} />
                <span>Back to Explorer</span>
              </button>
              
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="flex-grow">
                   <p className="text-[#8cc63f] font-sans font-bold uppercase tracking-[0.3em] text-[10px] mb-2">{currentCrop?.name}</p>
                   <h1 className="text-4xl md:text-7xl font-bold uppercase leading-tight tracking-tighter">{currentProduct?.name}</h1>
                </div>
                <div className="shrink-0 pb-2">
                   <div className="bg-[#8cc63f] text-[#2d5a27] px-6 py-2 rounded-full font-bold text-xs inline-block shadow-lg uppercase tracking-widest border border-white/20">
                      Premium Hybrid
                   </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          </header>

          <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 border-l-8 border-[#8cc63f] mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-[#2d5a27] mb-6 flex items-center gap-3 uppercase tracking-tight">
                <Info size={26} className="text-[#8cc63f]" />
                Agronomist Insights
              </h2>
              <div className="font-sans text-gray-700 leading-relaxed text-lg italic prose prose-green max-w-none border-t border-gray-50 pt-6">
                {insight}
              </div>
            </div>

            {currentGuide ? (
              <div className="space-y-10">
                <h2 className="text-2xl md:text-4xl font-bold text-[#2d5a27] text-center uppercase tracking-tighter mb-8">Cultivation Guide</h2>
                
                {currentGuide.nursery && (
                  <GuideCard icon={<Spade className="text-[#2d5a27]" />} title={currentGuide.nursery.title} points={currentGuide.nursery.points} />
                )}
                {currentGuide.directSowing && (
                  <GuideCard icon={<Leaf className="text-[#2d5a27]" />} title={currentGuide.directSowing.title} points={currentGuide.directSowing.points} />
                )}
                <GuideCard icon={<Shovel className="text-[#2d5a27]" />} title={currentGuide.landPrep.title} points={currentGuide.landPrep.points} />

                <div className="bg-[#2d5a27] text-white p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
                  <div className="p-5 bg-white/10 rounded-2xl shrink-0 group-hover:bg-[#8cc63f] group-hover:text-[#2d5a27] transition-all duration-500">
                    <Droplets size={44} />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-2 uppercase tracking-widest text-[#8cc63f]">Expert Management Tip</h4>
                    <p className="font-sans text-white/90 text-sm leading-relaxed uppercase tracking-wide">Regular monitoring for pests and diseases like Whiteflies or Powdery Mildew is essential. Always use clean irrigation water and balanced NPK fertilizer for maximum yield.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-16 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                <Globe className="mx-auto text-gray-300 mb-6" size={56} />
                <p className="text-gray-400 font-sans italic text-lg">Detailed cultivation guide for {currentCrop?.name} is being prepared.</p>
              </div>
            )}
            
            <button 
              onClick={handleBackToSearch}
              className="mt-16 w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-bold py-5 rounded-xl transition-all text-center shadow-sm uppercase text-sm tracking-widest"
            >
              <ArrowLeft size={18} />
              Back to Explorer
            </button>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#2d5a27] text-white py-20 px-6 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-10 uppercase tracking-tighter text-[#8cc63f]">{t.contactUs}</h2>
            <div className="space-y-8">
              <ContactItem icon={<MapPin className="text-[#8cc63f]" size={24} />} title="Himalaya Hybrid Seeds Company" content="1364, SEC-38, PHASE-1, INDUSTRIAL ESTATE, HSIIDC, RAI, (Dist. Sonipat) HARYANA - 131029" />
              <ContactItem icon={<Phone className="text-[#8cc63f]" size={24} />} content="+91-9873640440" />
              <ContactItem icon={<Mail className="text-[#8cc63f]" size={24} />} content="Himalayaseeds88@gmail.com" />
            </div>
          </div>

          <div className="flex flex-col gap-6 font-oswald font-bold uppercase tracking-widest text-[#8cc63f]">
            <h4 className="text-white opacity-40 text-xs mb-2">Quick Access</h4>
            <FooterLink onClick={handleBackToSearch}>{t.home}</FooterLink>
            <FooterLink onClick={() => {}}>My Catalog</FooterLink>
            <FooterLink onClick={() => {}}>{t.aboutUs}</FooterLink>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-white/10 pt-10 flex flex-col items-center">
          <p className="font-sans text-xs text-center mb-4 opacity-50 uppercase tracking-widest">{t.allRightsReserved}</p>
          <div className="text-[#8cc63f]/40 text-[10px] font-bold tracking-[0.3em] uppercase">
            HIMALAYA™ HYBRID SEEDS
          </div>
        </div>
      </footer>
    </div>
  );
};

const GuideCard: React.FC<{ icon: React.ReactNode, title: string, points: string[] }> = ({ icon, title, points }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-slide-up">
    <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-4">
      {icon}
      <h3 className="text-xl font-bold text-[#2d5a27] uppercase tracking-tight">{title}</h3>
    </div>
    <div className="p-8">
      <ul className="space-y-5">
        {points.map((point, idx) => (
          <li key={idx} className="flex gap-4 font-sans text-gray-600 text-base leading-relaxed">
            <div className="w-2 h-2 rounded-full bg-[#8cc63f] mt-2.5 shrink-0 shadow-sm"></div>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const ContactItem: React.FC<{ icon: React.ReactNode, title?: string, content: string }> = ({ icon, title, content }) => (
  <div className="flex gap-5 items-start">
    <div className="shrink-0 mt-1">{icon}</div>
    <div>
      {title && <p className="font-bold text-lg mb-1">{title}</p>}
      <p className="font-sans text-sm opacity-80 leading-relaxed uppercase tracking-wider">{content}</p>
    </div>
  </div>
);

const FooterLink: React.FC<{ children: React.ReactNode, onClick: () => void }> = ({ children, onClick }) => (
  <button onClick={onClick} className="block text-left hover:text-white transition-all text-xl font-light">
    {children}
  </button>
);

export default App;