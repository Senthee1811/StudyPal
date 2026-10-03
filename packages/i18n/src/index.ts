export type SupportedLocale = 'si' | 'ta' | 'en';

export interface TranslationDictionary {
  common: {
    appName: string;
    tagline: string;
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    submit: string;
    retry: string;
    next: string;
    previous: string;
    finish: string;
    selectLanguage: string;
    error: string;
    success: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    displayName: string;
    grade: string;
    loginButton: string;
    registerButton: string;
    logoutButton: string;
    noAccount: string;
    hasAccount: string;
    consentNotice: string;
  };
  nav: {
    dashboard: string;
    library: string;
    tutor: string;
    exams: string;
    progress: string;
    geography: string;
    admin: string;
  };
  library: {
    title: string;
    uploadPdf: string;
    dragDrop: string;
    statusUploaded: string;
    statusProcessing: string;
    statusReady: string;
    statusFailed: string;
    summary: string;
    citations: string;
    askQuestion: string;
    generateQuiz: string;
    sourcePages: string;
  };
  tutor: {
    title: string;
    startSession: string;
    placeholder: string;
    voiceCall: string;
    connectingVoice: string;
    aiTyping: string;
  };
  exams: {
    title: string;
    mockExams: string;
    startExam: string;
    timeRemaining: string;
    questionNumber: string;
    submitExam: string;
    score: string;
    reviewAnswers: string;
  };
  progress: {
    title: string;
    topicMastery: string;
    confidence: string;
    recommendations: string;
    evidenceCount: string;
    keepPracticing: string;
  };
  geography: {
    title: string;
    mapInstructions: string;
    locateFeature: string;
    correctLocation: string;
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    common: {
      appName: 'StudyPal Sri Lanka',
      tagline: 'Your Multilingual AI Learning Companion',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      submit: 'Submit',
      retry: 'Retry',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      selectLanguage: 'Language',
      error: 'An error occurred',
      success: 'Operation completed successfully',
    },
    auth: {
      loginTitle: 'Welcome Back',
      registerTitle: 'Create Student Account',
      email: 'Email Address',
      password: 'Password',
      displayName: 'Your Name',
      grade: 'School Grade (6 - 13)',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      logoutButton: 'Sign Out',
      noAccount: "Don't have an account? Sign up",
      hasAccount: 'Already have an account? Sign in',
      consentNotice: 'StudyPal is privacy-first. Minor accounts require parental consent.',
    },
    nav: {
      dashboard: 'Dashboard',
      library: 'Study Library',
      tutor: 'AI Tutor',
      exams: 'Exams & Quizzes',
      progress: 'Mastery Progress',
      geography: 'Sri Lanka Geography',
      admin: 'Content Review',
    },
    library: {
      title: 'Study Materials & Textbooks',
      uploadPdf: 'Upload PDF Document',
      dragDrop: 'Drag and drop government textbook or study notes (PDF, max 50MB)',
      statusUploaded: 'Uploaded',
      statusProcessing: 'Extracting & Indexing...',
      statusReady: 'Ready for Learning',
      statusFailed: 'Processing Failed',
      summary: 'Executive Summary',
      citations: 'Verified Page Citations',
      askQuestion: 'Ask Grounded Question',
      generateQuiz: 'Generate Practice Quiz',
      sourcePages: 'Source Pages',
    },
    tutor: {
      title: 'Multilingual AI Tutor',
      startSession: 'Start New Tutoring Session',
      placeholder: 'Ask any question about your curriculum...',
      voiceCall: 'Start Voice Tutoring (Vapi)',
      connectingVoice: 'Connecting voice session...',
      aiTyping: 'Tutor is thinking...',
    },
    exams: {
      title: 'Curriculum Exams & Practice Tests',
      mockExams: 'Official Model Papers',
      startExam: 'Begin Exam',
      timeRemaining: 'Time Remaining',
      questionNumber: 'Question',
      submitExam: 'Submit Exam',
      score: 'Your Score',
      reviewAnswers: 'Review Detailed Explanations',
    },
    progress: {
      title: 'Curriculum Mastery Tracking',
      topicMastery: 'Topic Mastery',
      confidence: 'Confidence Score',
      recommendations: 'AI Study Recommendations',
      evidenceCount: 'Questions Answered',
      keepPracticing: 'Recommended Practice Areas',
    },
    geography: {
      title: 'Sri Lanka Interactive Geography',
      mapInstructions: 'Click on the map to locate historical landmarks, rivers, and provinces.',
      locateFeature: 'Identify this location',
      correctLocation: 'Target Landmark Identified',
    },
  },
  si: {
    common: {
      appName: 'StudyPal ශ්‍රී ලංකා',
      tagline: 'ඔබේ බහුභාෂා AI අධ්‍යාපන සහකරු',
      loading: 'පූරණය වෙමින් පවතී...',
      save: 'සුරකින්න',
      cancel: 'අවලංගු කරන්න',
      delete: 'මකන්න',
      submit: 'ඉදිරිපත් කරන්න',
      retry: 'නැවත උත්සාහ කරන්න',
      next: 'මීළඟ',
      previous: 'පෙර',
      finish: 'අවසන් කරන්න',
      selectLanguage: 'භාෂාව',
      error: 'දෝෂයක් සිදුවිය',
      success: 'සාර්ථකයි',
    },
    auth: {
      loginTitle: 'නැවත සාදරයෙන් පිළිගනිමු',
      registerTitle: 'ශිෂ්‍ය ගිණුමක් සාදන්න',
      email: 'විද්‍යුත් තැපෑල',
      password: 'මුරපදය',
      displayName: 'ඔබේ නම',
      grade: 'පාසල් ශ්‍රේණිය (6 - 13)',
      loginButton: 'ඇතුල් වන්න',
      registerButton: 'ලියාපදිංචි වන්න',
      logoutButton: 'ඉවත් වන්න',
      noAccount: 'ගිණුමක් නැද්ද? ලියාපදිංචි වන්න',
      hasAccount: 'දැනටමත් ගිණුමක් තිබේද? ඇතුල් වන්න',
      consentNotice: 'StudyPal පුද්ගලිකත්වයට මුල් තැන දෙයි. දෙමාපිය අවසරය අවශ්‍යයි.',
    },
    nav: {
      dashboard: 'මුල් පිටුව',
      library: 'පොත් හා සටහන්',
      tutor: 'AI ගුරු සහකරු',
      exams: 'විභාග සහ ප්‍රශ්නාවලි',
      progress: 'ප්‍රගතිය සහ දක්ෂතාව',
      geography: 'ශ්‍රී ලංකා භූගෝල විද්‍යාව',
      admin: 'පරිපාලන සමාලෝචනය',
    },
    library: {
      title: 'පාසල් පෙළපොත් සහ සටහන්',
      uploadPdf: 'PDF ගොනුවක් එක් කරන්න',
      dragDrop: 'රජයේ පෙළපොත් හෝ සටහන් මෙතැනට දමන්න (PDF, උපරිම 50MB)',
      statusUploaded: 'උඩුගත විය',
      statusProcessing: 'සකසමින් පවතී...',
      statusReady: 'ඉගෙනීමට සූදානම්',
      statusFailed: 'සැකසීම අසාර්ථක විය',
      summary: 'ප්‍රධාන සාරාංශය',
      citations: 'තහවුරු කළ පිටු අංක',
      askQuestion: 'පෙළපොතෙන් ප්‍රශ්නයක් අසන්න',
      generateQuiz: 'ප්‍රශ්නාවලියක් සාදන්න',
      sourcePages: 'මූලාශ්‍ර පිටු',
    },
    tutor: {
      title: 'බහුභාෂා AI ගුරු සහකරු',
      startSession: 'නව සැසියක් අරඹන්න',
      placeholder: 'විෂය කරුණු පිළිබඳ ඕනෑම ප්‍රශ්නයක් අසන්න...',
      voiceCall: 'හඬ මගින් කතා කරන්න (Vapi)',
      connectingVoice: 'හඬ සැසිය සම්බන්ධ වෙමින් පවතී...',
      aiTyping: 'ගුරු සහකරු පිළිතුර සූදානම් කරමින් පවතී...',
    },
    exams: {
      title: 'ආදර්ශ විභාග ප්‍රශ්න පත්‍ර',
      mockExams: 'නිල ආදර්ශ ප්‍රශ්න පත්‍ර',
      startExam: 'විභාගය අරඹන්න',
      timeRemaining: 'ඉතිරි කාලය',
      questionNumber: 'ප්‍රශ්නය',
      submitExam: 'පිළිතුරු පත්‍රය භාර දෙන්න',
      score: 'ඔබේ ලකුණු',
      reviewAnswers: 'විස්තරාත්මක විවරණය',
    },
    progress: {
      title: 'විෂය ප්‍රවීණතා වාර්තාව',
      topicMastery: 'මාතෘකා ප්‍රවීණතාවය',
      confidence: 'විශ්වාසනීයත්ව ලකුණ',
      recommendations: 'AI නිර්දේශිත ඉගෙනුම් සැලසුම',
      evidenceCount: 'පිළිතුරු දුන් ප්‍රශ්න ගණන',
      keepPracticing: 'වැඩිදුර පුහුණුවට සුදුසු මාතෘකා',
    },
    geography: {
      title: 'ශ්‍රී ලංකා අන්තර්ක්‍රියාකාරී සිතියම',
      mapInstructions: 'ගංගා, කඳුවැටි, සහ ඓතිහාසික ස්ථාන සිතියම මත ලකුණු කරන්න.',
      locateFeature: 'ස්ථානය හඳුනාගන්න',
      correctLocation: 'ස්ථානය නිවැරදියි',
    },
  },
  ta: {
    common: {
      appName: 'StudyPal இலங்கை',
      tagline: 'உங்கள் பன்மொழி AI கல்வி வழிகாட்டி',
      loading: 'ஏற்றுகிறது...',
      save: 'சேமிக்க',
      cancel: 'ரத்து செய்',
      delete: 'நீக்கு',
      submit: 'சமர்ப்பிக்க',
      retry: 'மீண்டும் முயற்சி செய்',
      next: 'அடுத்து',
      previous: 'முந்தைய',
      finish: 'முடிக்க',
      selectLanguage: 'மொழி',
      error: 'பிழை ஏற்பட்டது',
      success: 'வெற்றிகரமாக முடிந்தது',
    },
    auth: {
      loginTitle: 'மீண்டும் வருக',
      registerTitle: 'மாணவர் கணக்கை உருவாக்கவும்',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      displayName: 'உங்கள் பெயர்',
      grade: 'வகுப்பு (6 - 13)',
      loginButton: 'உள்நுழைக',
      registerButton: 'பதிவு செய்க',
      logoutButton: 'வெளியேறுக',
      noAccount: 'கணக்கு இல்லையா? பதிவு செய்க',
      hasAccount: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக',
      consentNotice: 'StudyPal தனியுரிமைக்கு முன்னுரிமை அளிக்கிறது. பெற்றோர் ஒப்புதல் தேவை.',
    },
    nav: {
      dashboard: 'முகப்பு',
      library: 'பாடநூல்கள் & குறிப்புகள்',
      tutor: 'AI ஆசிரியர்',
      exams: 'பரீட்சைகள்',
      progress: 'தேர்ச்சி அறிக்கை',
      geography: 'இலங்கை புவியியல் வரைபடம்',
      admin: 'நிர்வாக ஆய்வு',
    },
    library: {
      title: 'பாடநூல்கள் & ஆவணங்கள்',
      uploadPdf: 'PDF ஆவணத்தைப் பதிவேற்றவும்',
      dragDrop: 'அரசு பாடநூல் அல்லது குறிப்புகளை இங்கே பதிவேற்றவும் (PDF, அதிகபட்சம் 50MB)',
      statusUploaded: 'பதிவேற்றப்பட்டது',
      statusProcessing: 'செயலாக்கத்தில் உள்ளது...',
      statusReady: 'படிப்பதற்கு தயார்',
      statusFailed: 'செயலாக்கம் தோல்வியடைந்தது',
      summary: 'பாடச் சுருக்கம்',
      citations: 'சரிபார்க்கப்பட்ட பக்க எண்கள்',
      askQuestion: 'கேள்வி கேட்க',
      generateQuiz: 'பயிற்சி வினாடிவினா உருவாக்கு',
      sourcePages: 'ஆதாரப் பக்கங்கள்',
    },
    tutor: {
      title: 'பன்மொழி AI ஆசிரியர்',
      startSession: 'புதிய அமர்வைத் தொடங்கவும்',
      placeholder: 'பாடத்திட்டம் பற்றி ஏதேனும் கேள்வி கேளுங்கள்...',
      voiceCall: 'குரல் வழி உரையாடல் (Vapi)',
      connectingVoice: 'குரல் அமர்வு இணைக்கப்படுகிறது...',
      aiTyping: 'ஆசிரியர் யோசிக்கிறார்...',
    },
    exams: {
      title: 'மாதிரிப் பரீட்சை வினாத்தாள்கள்',
      mockExams: 'அதிகாரப்பூர்வ மாதிரி வினாத்தாள்கள்',
      startExam: 'பரீட்சையைத் தொடங்கு',
      timeRemaining: 'மீதமுள்ள நேரம்',
      questionNumber: 'வினா',
      submitExam: 'விடைத்தாளைச் சமர்ப்பி',
      score: 'உங்கள் மதிப்பெண்',
      reviewAnswers: 'விளக்கங்களை மதிப்பாய்வு செய்க',
    },
    progress: {
      title: 'பாடத் தேர்ச்சி கண்காணிப்பு',
      topicMastery: 'பாடத் தேர்ச்சி',
      confidence: 'நம்பகத்தன்மை அளவு',
      recommendations: 'AI பரிந்துரைக்கும் பயிற்சி',
      evidenceCount: 'பதிலளித்த கேள்விகள்',
      keepPracticing: 'பரிந்துரைக்கப்படும் பகுதிகள்',
    },
    geography: {
      title: 'இலங்கை ஊடாடும் வரைபடம்',
      mapInstructions: 'வரலாற்று இடங்கள், ஆறுகள் மற்றும் மாகாணங்களை வரைபடத்தில் அடையாளம் காணவும்.',
      locateFeature: 'இடத்தைக் கண்டறியவும்',
      correctLocation: 'சரியான இடம் அடையாளம் காணப்பட்டது',
    },
  },
};

export function getTranslation(locale: SupportedLocale = 'en'): TranslationDictionary {
  return translations[locale] || translations.en;
}
