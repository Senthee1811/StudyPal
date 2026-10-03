import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

export async function seedContentDatabase() {
  console.log('[Seed:Content] Starting curriculum seed...');

  // 1. Create or ensure Curriculum Version
  let curriculum = await prisma.curriculumVersion.findFirst({
    where: { year: 2024 },
  });

  if (!curriculum) {
    curriculum = await prisma.curriculumVersion.create({
      data: {
        name: 'National Curriculum of Sri Lanka (NIE Revised)',
        year: 2024,
        isActive: true,
      },
    });
  }

  // 2. Grade 9 Mathematics
  let mathsSubject = await prisma.subject.findFirst({
    where: { code: 'MATH-G9', curriculumVersionId: curriculum.id },
  });

  if (!mathsSubject) {
    mathsSubject = await prisma.subject.create({
      data: {
        curriculumVersionId: curriculum.id,
        code: 'MATH-G9',
        nameEn: 'Mathematics (Grade 9)',
        nameSi: 'ගණිතය (9 ශ්‍රේණිය)',
        nameTa: 'கணிதம் (தரம் 9)',
        grade: 9,
        icon: 'calculator',
      },
    });

    // Topic 1: Real Numbers & Indices (Concept: CONCEPT-MATH-G9-01)
    const conceptMath1 = 'CONCEPT-MATH-G9-01';
    const topicMathEn = await prisma.topic.create({
      data: {
        subjectId: mathsSubject.id,
        conceptId: conceptMath1,
        language: 'en',
        name: 'Real Numbers & Scientific Notation',
        description: 'Laws of indices, standard form, and square roots',
        orderIndex: 1,
      },
    });

    await prisma.topic.create({
      data: {
        subjectId: mathsSubject.id,
        conceptId: conceptMath1,
        language: 'si',
        name: 'තාත්වික සංඛ්‍යා සහ විද්‍යාත්මක අංකනය',
        description: 'දර්ශක නීති, සම්මත ආකාරය සහ වර්ගමූල',
        orderIndex: 1,
      },
    });

    await prisma.topic.create({
      data: {
        subjectId: mathsSubject.id,
        conceptId: conceptMath1,
        language: 'ta',
        name: 'மெய் எண்களும் விஞ்ஞானக் குறியீடும்',
        description: 'சுட்டி விதிகள், நியம வடிவம் மற்றும் வர்க்கமூலம்',
        orderIndex: 1,
      },
    });

    // Official Sample Question for Math Topic (English)
    await prisma.question.create({
      data: {
        topicId: topicMathEn.id,
        language: 'en',
        type: 'MCQ',
        prompt: 'What is the value of 2^3 × 2^4 expressed as a single power of 2?',
        options: ['2^7', '2^12', '4^7', '4^12'],
        correctAnswer: '2^7',
        explanation: 'According to index law a^m × a^n = a^(m+n), 2^3 × 2^4 = 2^(3+4) = 2^7.',
        difficulty: 'EASY',
        marks: 2,
        status: 'APPROVED',
      },
    });

    // Topic 2: Linear Equations & Algebra (Concept: CONCEPT-MATH-G9-02)
    const conceptMath2 = 'CONCEPT-MATH-G9-02';
    await prisma.topic.create({
      data: {
        subjectId: mathsSubject.id,
        conceptId: conceptMath2,
        language: 'en',
        name: 'Linear Equations in One Variable',
        description: 'Solving simple algebraic equations with fractions and brackets',
        orderIndex: 2,
      },
    });

    await prisma.topic.create({
      data: {
        subjectId: mathsSubject.id,
        conceptId: conceptMath2,
        language: 'si',
        name: 'එක් අඥාතයක් සහිත ඒකජ සමීකරණ',
        description: 'වරහන් සහ භාග සහිත වීජීය සමීකරණ විසඳීම',
        orderIndex: 2,
      },
    });

    await prisma.topic.create({
      data: {
        subjectId: mathsSubject.id,
        conceptId: conceptMath2,
        language: 'ta',
        name: 'ஒரு மாறியில் அமைந்த ஒருபடிச் சமன்பாடுகள்',
        description: 'அடைப்புக்குறிகள் மற்றும் பின்னங்களைக் கொண்ட சமன்பாடுகள்',
        orderIndex: 2,
      },
    });
  }

  // 3. Grade 9 Geography
  let geoSubject = await prisma.subject.findFirst({
    where: { code: 'GEO-G9', curriculumVersionId: curriculum.id },
  });

  if (!geoSubject) {
    geoSubject = await prisma.subject.create({
      data: {
        curriculumVersionId: curriculum.id,
        code: 'GEO-G9',
        nameEn: 'Geography of Sri Lanka (Grade 9)',
        nameSi: 'ශ්‍රී ලංකාවේ භූගෝල විද්‍යාව (9 ශ්‍රේණිය)',
        nameTa: 'இலங்கையின் புவியியல் (தரம் 9)',
        grade: 9,
        icon: 'globe',
      },
    });

    // Topic 1: Physical Features & Relief of Sri Lanka (Concept: CONCEPT-GEO-G9-01)
    const conceptGeo1 = 'CONCEPT-GEO-G9-01';
    const topicGeoEn = await prisma.topic.create({
      data: {
        subjectId: geoSubject.id,
        conceptId: conceptGeo1,
        language: 'en',
        name: 'Topography and Relief Features of Sri Lanka',
        description: 'Central highlands, southwest lowlands, and coastal plains',
        orderIndex: 1,
      },
    });

    await prisma.topic.create({
      data: {
        subjectId: geoSubject.id,
        conceptId: conceptGeo1,
        language: 'si',
        name: 'ශ්‍රී ලංකාවේ භූ විෂමතාව සහ උස්බිම් ලක්ෂණ',
        description: 'මධ්‍යම කඳුකරය, තැනිතලා සහ වෙරළබඩ කලාප',
        orderIndex: 1,
      },
    });

    await prisma.topic.create({
      data: {
        subjectId: geoSubject.id,
        conceptId: conceptGeo1,
        language: 'ta',
        name: 'இலங்கையின் தரைத்தோற்றமும் நிலவுருவங்களும்',
        description: 'மத்திய மலைநாடு, சமவெளிகள் மற்றும் கரையோரப் பகுதிகள்',
        orderIndex: 1,
      },
    });

    // Official Geography Question
    await prisma.question.create({
      data: {
        topicId: topicGeoEn.id,
        language: 'en',
        type: 'MCQ',
        prompt: 'Which is the highest mountain peak in Sri Lanka?',
        options: ['Pidurutalagala', 'Kirigalpotta', 'Adams Peak (Sri Pada)', 'Namunukula'],
        correctAnswer: 'Pidurutalagala',
        explanation: 'Mount Pidurutalagala is Sri Lanka highest peak, standing at 2,524 meters above sea level.',
        difficulty: 'EASY',
        marks: 2,
        status: 'APPROVED',
      },
    });
  }

  // 4. Sri Lanka Geography Map Features
  const featuresCount = await prisma.mapFeature.count();
  if (featuresCount === 0) {
    const pib = await prisma.mapFeature.create({
      data: {
        nameEn: 'Mount Pidurutalagala',
        nameSi: 'පිදුරුතලාගල කන්ද',
        nameTa: 'பீதுருதலாகலை மலை',
        category: 'MOUNTAIN',
        latitude: 7.0008,
        longitude: 80.7725,
        descriptionEn: 'The highest point in Sri Lanka located near Nuwara Eliya (2,524 m).',
        descriptionSi: 'ශ්‍රී ලංකාවේ උසම කඳු මුදුන (මීටර් 2,524).',
        descriptionTa: 'இலங்கையின் மிக உயர்ந்த மலை உச்சி (2,524 மீ).',
      },
    });

    const mahaweli = await prisma.mapFeature.create({
      data: {
        nameEn: 'Mahaweli River Outflow (Trincomalee)',
        nameSi: 'මහවැලි ගඟ මෝය (ත්‍රිකුණාමලය)',
        nameTa: 'மகாவலி கங்கை முகத்துவாரம் (திருகோணமலை)',
        category: 'RIVER',
        latitude: 8.4554,
        longitude: 81.2335,
        descriptionEn: 'The longest river in Sri Lanka (335 km), flowing into Koddiyar Bay.',
        descriptionSi: 'ශ්‍රී ලංකාවේ දිගම ගංගාව (කිලෝමීටර් 335).',
        descriptionTa: 'இலங்கையின் மிக நீளமான நதி (335 கி.மீ).',
      },
    });

    const sigiriya = await prisma.mapFeature.create({
      data: {
        nameEn: 'Sigiriya Rock Fortress',
        nameSi: 'සීගිරිය පර්වත බලකොටුව',
        nameTa: 'சீகிரியா குன்றுக்கோட்டை',
        category: 'HISTORICAL',
        latitude: 7.957,
        longitude: 80.7603,
        descriptionEn: 'Ancient palace and fortress complex built by King Kashyapa in the 5th century.',
        descriptionSi: 'පස්වන සියවසේ කාශ්‍යප රජු විසින් ඉදිකළ පර්වත බලකොටුව.',
        descriptionTa: '5 ஆம் நூற்றாண்டில் காசியப்ப மன்னனால் கட்டப்பட்ட குன்றுக்கோட்டை.',
      },
    });

    // Map Questions
    await prisma.mapQuestion.create({
      data: {
        mapFeatureId: pib.id,
        promptEn: 'Locate Mount Pidurutalagala on the relief map of Sri Lanka.',
        promptSi: 'ශ්‍රී ලංකා සිතියමේ පිදුරුතලාගල කන්ද පිහිටි ස්ථානය ලකුණු කරන්න.',
        promptTa: 'இலங்கை வரைபடத்தில் பீதுருதலாகலை மலையின் இருப்பிடத்தைக் குறிக்கவும்.',
        toleranceKm: 30.0,
        marks: 5,
      },
    });

    await prisma.mapQuestion.create({
      data: {
        mapFeatureId: sigiriya.id,
        promptEn: 'Click on the ancient UNESCO World Heritage fortress of Sigiriya.',
        promptSi: 'සීගිරිය ඓතිහාසික බලකොටුව පිහිටි ස්ථානය මත ක්ලික් කරන්න.',
        promptTa: 'சீகிரியா குன்றுக்கோட்டை அமைந்துள்ள இடத்தைக் கிளிக் செய்யவும்.',
        toleranceKm: 25.0,
        marks: 5,
      },
    });
  }

  console.log('[Seed:Content] Curriculum and geography features seeded successfully.');
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedContentDatabase()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error(err);
      prisma.$disconnect();
      process.exit(1);
    });
}
