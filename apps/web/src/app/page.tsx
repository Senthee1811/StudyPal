'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/language-context';
import { useAuth } from '../context/auth-context';
import {
  StorysetStudentStudy,
  StorysetAiTutor,
  StorysetExamPassed,
  StorysetMapExplore,
  StorysetAnalyticsGrowth,
} from '../components/illustrations';
import {
  Sparkles,
  ArrowRight,
  Globe,
  BookOpen,
  CheckCircle2,
  Flame,
  Award,
  MapPin,
  BrainCircuit,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

/**
 * StudyPal Landing Page — Duolingo Style Reference
 *
 * Visual System:
 * - Canvas: Paper White (#ffffff)
 * - Headings: #58cc02 (Eager Green) or #4b4b4b (Charcoal) in Feather / Nunito 700/800
 * - Body: #777777 (Pencil Gray) at 17px/1.4, max-width ~500px
 * - Primary CTA: #58cc02 fill, white text, 15px uppercase tracking, 12px radius, 3D bottom border
 * - Outlined CTA: #1cb0f6 text, transparent fill, 2px solid border, 12px radius
 * - Alternating text/illustration sections with 80-120px generous breathing room
 * - Full-bleed Eager Green (#58cc02) footer band with #d7ffb8 text accents
 */
export default function LandingPage() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="w-full bg-white text-[#4b4b4b]">
      {/* ── 1. HERO SECTION (Alternating: Text Left, Mascot Right) ── */}
      <section className="max-w-[1200px] mx-auto px-6 pt-12 pb-20 md:py-24">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Left */}
          <div className="flex-1 max-w-[560px] space-y-6 text-center md:text-left">
            {/* National Curriculum Sticker Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[12px] bg-[#d7ffb8]/60 border-2 border-[#58cc02]/30 text-[#1a3300] text-[13px] font-bold uppercase tracking-[0.053em]">
              <Sparkles className="w-4 h-4 text-[#58cc02]" />
              <span>Sri Lanka National Curriculum • NIE Aligned</span>
            </div>

            {/* Hero Headline in Charcoal #4b4b4b with playful rounded weight */}
            <h1 className="text-[34px] sm:text-[44px] lg:text-[48px] font-feather font-extrabold text-[#4b4b4b] leading-[1.18] tracking-[-0.02em]">
              {locale === 'si' ? (
                <>
                  ශ්‍රී ලංකා විභාග ජයගන්න{' '}
                  <span className="text-[#58cc02]">පහසුම හා විනෝදජනක</span> මඟ.
                </>
              ) : locale === 'ta' ? (
                <>
                  இலங்கை பரீட்சைகளில் வெல்ல{' '}
                  <span className="text-[#58cc02]">எளிய, சுவாரசியமான</span> வழி.
                </>
              ) : (
                <>
                  The free, fun, and effective way to learn for{' '}
                  <span className="text-[#58cc02]">Sri Lankan exams.</span>
                </>
              )}
            </h1>

            {/* Body in Pencil Gray #777777 */}
            <p className="text-[17px] text-[#777777] leading-[1.5] max-w-[500px] mx-auto md:mx-0">
              {locale === 'si'
                ? '6 සිට 13 ශ්‍රේණිය දක්වා විෂය නිර්දේශය ඔබේ මව්බසින්ම ඉගෙන ගන්න. පොත් කියවන්න, පසුගිය ප්‍රශ්න පත්‍ර පුහුණු වන්න, සහ සිතියම් ලකුණු කරන්න.'
                : locale === 'ta'
                ? 'தரம் 6 முதல் 13 வரை உங்கள் தாய்மொழியில் சுலபமாகப் படியுங்கள். பாடப்புத்தகங்களை ஆராயுங்கள், மாதிரி வினாத்தாள்களைப் பயிற்சி செய்யுங்கள்.'
                : 'Master the national syllabus from Grade 6 to O/L & A/L. Chat with textbooks in Sinhala, Tamil, or English, test your knowledge with mock exams, and master island geography.'}
            </p>

            {/* Duolingo Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#58cc02] text-white text-[15px] font-feather font-bold uppercase tracking-[0.053em] rounded-[12px] border-b-4 border-[#46a302] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 transition-all shadow-sm"
                >
                  <span>{locale === 'si' ? 'අධ්‍යයන පුවරුවට' : locale === 'ta' ? 'கற்றல் பலகை' : 'OPEN DASHBOARD'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#58cc02] text-white text-[15px] font-feather font-bold uppercase tracking-[0.053em] rounded-[12px] border-b-4 border-[#46a302] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 transition-all shadow-sm"
                  >
                    <span>{locale === 'si' ? 'නොමිලේ ආරම්භ කරන්න' : locale === 'ta' ? 'இலவசமாகத் தொடங்குங்கள்' : 'GET STARTED'}</span>
                  </Link>

                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent text-[#1cb0f6] text-[14px] font-feather font-bold uppercase tracking-[0.053em] rounded-[12px] border-2 border-[#afafaf] hover:border-[#1cb0f6] hover:bg-[#1cb0f6]/5 active:translate-y-1 transition-all"
                  >
                    <span>{locale === 'si' ? 'මට දැනටමත් ගිණුමක් ඇත' : locale === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளது' : 'I ALREADY HAVE AN ACCOUNT'}</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mascot / Student Illustration Right */}
          <div className="flex-1 flex justify-center items-center">
            <StorysetStudentStudy className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px]" />
          </div>
        </div>
      </section>

      {/* ── BORDER DIVIDER ── */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="border-t-2 border-[#e5e5e5]" />
      </div>

      {/* ── 2. FEATURE SECTION: FREE. FUN. EFFECTIVE. (Text Left, Illustration Right) ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Left */}
          <div className="flex-1 max-w-[500px] space-y-5 text-center md:text-left">
            <h2 className="text-[34px] sm:text-[44px] font-feather font-extrabold text-[#58cc02] leading-[1.2] tracking-[-0.02em] lowercase">
              {locale === 'si' ? 'නොමිලේ. විනෝදජනකයි. සාර්ථකයි.' : locale === 'ta' ? 'இலவசம். சுவாரசியம். பயனுள்ளது.' : 'free. fun. effective.'}
            </h2>
            <p className="text-[17px] text-[#777777] leading-[1.5]">
              {locale === 'si'
                ? 'StudyPal සමඟ ඉගෙනීම විනෝදජනක මෙන්ම ඵලදායී වේ! කුඩා කොටස් වශයෙන් සකස් කළ පාඩම්, විභාග ප්‍රශ්න පත්‍ර සාකච්ඡා සහ දක්ෂතා ඇගයීම් මඟින් ඔබේ දැනුම වර්ධනය කරයි.'
                : locale === 'ta'
                ? 'StudyPal உடன் கற்பது மிகவும் மகிழ்ச்சியானது! சிறிய அளவிலான பாடங்கள், முந்தைய வினாத்தாள் பயிற்சிகள் மற்றும் உடனடி மதிப்பெண் மூலம் சிறந்த பெறுபேறுகளை அடையுங்கள்.'
                : "Learning with StudyPal is fun, and research shows that it works! With bite-sized lessons, stepped explanations, and instant past paper grading, you'll build real mastery for Grade 6 to O/L & A/L."}
            </p>

            <div className="pt-2">
              <Link
                href="/curriculum"
                className="inline-flex items-center gap-2 text-[#1cb0f6] text-[15px] font-feather font-bold uppercase tracking-[0.053em] hover:underline"
              >
                <span>{locale === 'si' ? 'විෂය නිර්දේශය බලන්න' : locale === 'ta' ? 'பாடத்திட்டத்தைப் பாருங்கள்' : 'EXPLORE CURRICULUM'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Illustration Right */}
          <div className="flex-1 flex justify-center items-center">
            <StorysetAnalyticsGrowth className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]" />
          </div>
        </div>
      </section>

      {/* ── BORDER DIVIDER ── */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="border-t-2 border-[#e5e5e5]" />
      </div>

      {/* ── 3. FEATURE SECTION: TRILINGUAL AI MENTOR (Illustration Left, Text Right) ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Illustration Left */}
          <div className="flex-1 flex justify-center items-center">
            <StorysetAiTutor className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]" />
          </div>

          {/* Text Right */}
          <div className="flex-1 max-w-[500px] space-y-5 text-center md:text-left">
            <h2 className="text-[34px] sm:text-[44px] font-feather font-extrabold text-[#58cc02] leading-[1.2] tracking-[-0.02em] lowercase">
              {locale === 'si'
                ? 'ඔබේ මව්බසින් පෞද්ගලික ඉගෙනුම.'
                : locale === 'ta'
                ? 'உங்கள் தாய்மொழியில் தனிப்பயன் கற்றல்.'
                : 'personalized learning in your mother tongue.'}
            </h2>
            <p className="text-[17px] text-[#777777] leading-[1.5]">
              {locale === 'si'
                ? 'භාෂා බාධක නොමැත. සිංහල, දෙමළ හෝ ඉංග්‍රීසි මාධ්‍යයෙන් ඕනෑම ප්‍රශ්නයක් අසන්න. අපගේ AI ගුරුවරයා ඔබට සුහදශීලීව පියවරෙන් පියවර පැහැදිලි කර දෙනු ඇත.'
                : locale === 'ta'
                ? 'மொழி தடைகள் இல்லை. சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில் எந்த கேள்வியையும் கேளுங்கள். எங்கள் AI வழிகாட்டி உங்களுக்குப் பொறுமையுடன் விளக்கும்.'
                : 'StudyPal adapts to your pace and language. Ask questions in Sinhala (සිංහල), Tamil (தமிழ்), or English. Get voice tutor explanations, stepped math breakdown, and conversational feedback tailored to the NIE syllabus.'}
            </p>

            {/* Language Sticker Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <span className="px-3.5 py-1.5 rounded-[12px] bg-[#d7ffb8]/60 border-2 border-[#58cc02]/30 text-[#1a3300] text-[13px] font-bold uppercase tracking-[0.053em]">
                සිංහල මාධ්‍යය
              </span>
              <span className="px-3.5 py-1.5 rounded-[12px] bg-[#d7ffb8]/60 border-2 border-[#58cc02]/30 text-[#1a3300] text-[13px] font-bold uppercase tracking-[0.053em]">
                தமிழ் மொழி
              </span>
              <span className="px-3.5 py-1.5 rounded-[12px] bg-[#d7ffb8]/60 border-2 border-[#58cc02]/30 text-[#1a3300] text-[13px] font-bold uppercase tracking-[0.053em]">
                English Medium
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/study-room"
                className="inline-flex items-center gap-2 text-[#1cb0f6] text-[15px] font-feather font-bold uppercase tracking-[0.053em] hover:underline"
              >
                <span>{locale === 'si' ? 'AI කාමරයට පිවිසෙන්න' : locale === 'ta' ? 'AI அறைக்குச் செல்லுங்கள்' : 'ENTER STUDY ROOM'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BORDER DIVIDER ── */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="border-t-2 border-[#e5e5e5]" />
      </div>

      {/* ── 4. FEATURE SECTION: PAST PAPERS & TIMED EXAMS (Text Left, Illustration Right) ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Left */}
          <div className="flex-1 max-w-[500px] space-y-5 text-center md:text-left">
            <h2 className="text-[34px] sm:text-[44px] font-feather font-extrabold text-[#58cc02] leading-[1.2] tracking-[-0.02em] lowercase">
              {locale === 'si'
                ? 'නියම විභාග අත්දැකීමෙන් සූදානම් වන්න.'
                : locale === 'ta'
                ? 'உண்மையான பரீட்சை அனுபவத்துடன் பயிற்சி.'
                : 'stay motivated with real exam practice.'}
            </h2>
            <p className="text-[17px] text-[#777777] leading-[1.5]">
              {locale === 'si'
                ? 'සාමාන්‍ය පෙළ සහ උසස් පෙළ විභාග බිය දුරු කරගන්න. නියමිත කාල සීමාව තුළ ආදර්ශ ප්‍රශ්න පත්‍රවලට පිළිතුරු සපයන්න. නිල ලකුණු දීමේ පටිපාටිය අනුව ක්ෂණික ප්‍රතිඵල ලබාගන්න.'
                : locale === 'ta'
                ? 'க.பொ.த சாதாரண மற்றும் உயர்தரப் பரீட்சை பயத்தை வெல்லுங்கள். நேர வரம்புடன் கூடிய மாதிரி வினாத்தாள்களைப் பயிற்சி செய்து உத்தியோகபூர்வ மதிப்பீட்டைப் பெறுங்கள்.'
                : 'We make it easy to form study habits with timed mock exams, instant grading against official marking criteria, and streak rewards that keep you coming back every day.'}
            </p>

            {/* Sticker Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <span className="px-3.5 py-1.5 rounded-[12px] bg-white border-2 border-[#afafaf] text-[#777777] text-[13px] font-bold uppercase tracking-[0.053em]">
                TIMED MOCK PAPERS
              </span>
              <span className="px-3.5 py-1.5 rounded-[12px] bg-white border-2 border-[#afafaf] text-[#777777] text-[13px] font-bold uppercase tracking-[0.053em]">
                OFFICIAL MARK SCHEMES
              </span>
              <span className="px-3.5 py-1.5 rounded-[12px] bg-white border-2 border-[#afafaf] text-[#777777] text-[13px] font-bold uppercase tracking-[0.053em]">
                DAILY STREAKS 🔥
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 text-[#1cb0f6] text-[15px] font-feather font-bold uppercase tracking-[0.053em] hover:underline"
              >
                <span>{locale === 'si' ? 'ප්‍රශ්න පත්‍ර පුහුණුවන්න' : locale === 'ta' ? 'வினாத்தாள் பயிற்சி' : 'PRACTICE EXAMS'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Illustration Right */}
          <div className="flex-1 flex justify-center items-center">
            <StorysetExamPassed className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]" />
          </div>
        </div>
      </section>

      {/* ── BORDER DIVIDER ── */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="border-t-2 border-[#e5e5e5]" />
      </div>

      {/* ── 5. FEATURE SECTION: SRI LANKA MAP LAB (Illustration Left, Text Right) ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Illustration Left */}
          <div className="flex-1 flex justify-center items-center">
            <StorysetMapExplore className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]" />
          </div>

          {/* Text Right */}
          <div className="flex-1 max-w-[500px] space-y-5 text-center md:text-left">
            <h2 className="text-[34px] sm:text-[44px] font-feather font-extrabold text-[#58cc02] leading-[1.2] tracking-[-0.02em] lowercase">
              {locale === 'si'
                ? 'අන්තර්ක්‍රියාකාරී ශ්‍රී ලංකා සිතියම් විද්‍යාගාරය.'
                : locale === 'ta'
                ? 'இலங்கை ஊடாடும் வரைபட ஆய்வகம்.'
                : 'interactive Sri Lanka geography lab.'}
            </h2>
            <p className="text-[17px] text-[#777777] leading-[1.5]">
              {locale === 'si'
                ? 'සාමාන්‍ය පෙළ භූගෝල විද්‍යාව 2 වන ප්‍රශ්න පත්‍රයේ සිතියම් ප්‍රශ්නවලට සූදානම් වන්න. ගංගා, ජලාශ (වැව්), කඳු පන්ති සහ වරායන් සිතියම මත සෘජුවම ලකුණු කර නිරවද්‍යතාව පරීක්ෂා කරගන්න.'
                : locale === 'ta'
                ? 'க.பொ.த சாதாரண தர புவியியல் பகுதி 2 வரைபட வினாக்களுக்கு இலகுவாகத் தயாராகுங்கள். ஆறுகள், குளங்கள், மலைத்தொடர்கள் மற்றும் துறைமுகங்களைக் குறித்துத் துல்லியத்தைப் பாருங்கள்.'
                : 'Practice O/L Geography Paper 2 Part A right in your browser. Pin rivers (Mahaweli, Kelani), ancient reservoirs (Parakrama Samudra), peaks, and ports on the island map with real-time GPS tolerance scoring.'}
            </p>

            <div className="pt-2">
              <Link
                href="/map-lab"
                className="inline-flex items-center gap-2 text-[#1cb0f6] text-[15px] font-feather font-bold uppercase tracking-[0.053em] hover:underline"
              >
                <span>{locale === 'si' ? 'සිතියම් විද්‍යාගාරය විවෘත කරන්න' : locale === 'ta' ? 'வரைபட ஆய்வகம் திறக்க' : 'OPEN MAP LAB'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BORDER DIVIDER ── */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="border-t-2 border-[#e5e5e5]" />
      </div>

      {/* ── 6. PRE-FOOTER CONVERSION BANNER (Centered) ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28 text-center space-y-6">
        <h2 className="text-[38px] sm:text-[52px] font-feather font-extrabold text-[#58cc02] leading-[1.15] tracking-[-0.02em] lowercase">
          {locale === 'si' ? 'ඕනෑම තැනක සිට, ඕනෑම වේලාවක.' : locale === 'ta' ? 'எங்கும், எப்போதும் கற்கலாம்.' : 'learn anytime, anywhere.'}
        </h2>
        <p className="text-[17px] text-[#777777] max-w-[540px] mx-auto leading-[1.5]">
          {locale === 'si'
            ? 'ශ්‍රී ලංකාවේ සියලුම දරු දැරියන්ට නොමිලේ අධ්‍යාපනය ලබාදෙන එකම ඩිජිටල් ඉගෙනුම් වේදිකාව. අදම එක්වන්න!'
            : locale === 'ta'
            ? 'இலங்கையின் அனைத்து மாணவர்களுக்கும் இலவச கல்வி வழங்கும் டிஜிட்டல் தளம். இன்றே இணையுங்கள்!'
            : 'Boost your exam scores with StudyPal on web and mobile. Free forever for every student across Sri Lanka.'}
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#58cc02] text-white text-[16px] font-feather font-bold uppercase tracking-[0.053em] rounded-[12px] border-b-4 border-[#46a302] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 transition-all shadow-md"
          >
            <span>{locale === 'si' ? 'නොමිලේ එක්වන්න' : locale === 'ta' ? 'இலவசமாக இணையுங்கள்' : 'GET STARTED FOR FREE'}</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </section>

      {/* ── 7. FOOTER (Full-Width Eager Green Band #58cc02) ── */}
      <footer className="w-full bg-[#58cc02] text-white pt-16 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 space-y-12">
          {/* Multi-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Col 1: About */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-feather font-bold uppercase tracking-[0.053em] text-white">
                About Us
              </h3>
              <ul className="space-y-2 text-[14px] text-[#d7ffb8]">
                <li>
                  <Link href="/curriculum" className="hover:text-white transition-colors">
                    National Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="/curriculum" className="hover:text-white transition-colors">
                    NIE Syllabus Alignment
                  </Link>
                </li>
                <li>
                  <Link href="/progress" className="hover:text-white transition-colors">
                    Mastery Science Engine
                  </Link>
                </li>
                <li>
                  <span className="opacity-80">Free Education Policy</span>
                </li>
              </ul>
            </div>

            {/* Col 2: Products */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-feather font-bold uppercase tracking-[0.053em] text-white">
                Learning Tools
              </h3>
              <ul className="space-y-2 text-[14px] text-[#d7ffb8]">
                <li>
                  <Link href="/study-room" className="hover:text-white transition-colors">
                    AI Study Room & Voice
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="hover:text-white transition-colors">
                    Document Library & PDF
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-white transition-colors">
                    Timed O/L & A/L Exams
                  </Link>
                </li>
                <li>
                  <Link href="/map-lab" className="hover:text-white transition-colors">
                    Sri Lanka Map Lab
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Grades */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-feather font-bold uppercase tracking-[0.053em] text-white">
                Grades & Syllabus
              </h3>
              <ul className="space-y-2 text-[14px] text-[#d7ffb8]">
                <li>
                  <Link href="/curriculum" className="hover:text-white transition-colors">
                    Grade 6–9 (Junior Secondary)
                  </Link>
                </li>
                <li>
                  <Link href="/curriculum" className="hover:text-white transition-colors">
                    Grade 10–11 (G.C.E. O/L)
                  </Link>
                </li>
                <li>
                  <Link href="/curriculum" className="hover:text-white transition-colors">
                    Grade 12–13 (G.C.E. A/L)
                  </Link>
                </li>
                <li>
                  <Link href="/curriculum" className="hover:text-white transition-colors">
                    Mathematics & Science
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Languages & Help */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-feather font-bold uppercase tracking-[0.053em] text-white">
                Languages & Trust
              </h3>
              <ul className="space-y-2 text-[14px] text-[#d7ffb8]">
                <li>
                  <span className="font-semibold text-white">සිංහල මාධ්‍යය</span>
                </li>
                <li>
                  <span className="font-semibold text-white">தமிழ் மொழி மூலம்</span>
                </li>
                <li>
                  <span className="font-semibold text-white">English Medium</span>
                </li>
                <li>
                  <span className="text-[12px] opacity-80">Student Privacy Guaranteed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Mascot Bar */}
          <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#d7ffb8]">
            <div className="flex items-center gap-3">
              <span className="font-feather font-extrabold text-[16px] text-white tracking-wide">
                StudyPal Sri Lanka
              </span>
              <span>•</span>
              <span>Playful AI classroom for every student</span>
            </div>
            <p className="text-center sm:text-right">
              Made with ❤️ for Sri Lankan school students • © {new Date().getFullYear()} StudyPal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
