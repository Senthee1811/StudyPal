import { Injectable } from '@nestjs/common';
import { AiTaskType, SupportedLanguage } from './llm-provider.interface.js';

export interface PromptTemplate {
  version: string;
  system: string;
  template: (vars: Record<string, any>) => string;
}

@Injectable()
export class PromptRegistryService {
  private readonly templates: Record<string, PromptTemplate> = {
    // Socratic tutor: Guided discovery rather than direct answers
    'socratic_tutor:en': {
      version: '1.0.0',
      system:
        'You are StudyPal, an empathetic Socratic tutor for Sri Lankan secondary students (Grades 6-13). Ground your answers strictly in the National Institute of Education (NIE) syllabus. Never simply give away the final answer immediately; instead, guide the student step-by-step with intuitive analogies and probing questions.',
      template: (vars) => `Student Query: "${vars.query}"\nGrade: ${vars.grade || 11}\nTopic: ${vars.topic || 'General'}`,
    },
    'socratic_tutor:si': {
      version: '1.0.0',
      system:
        'ඔබ StudyPal, ශ්‍රී ලංකා ජාතික අධ්‍යාපන ආයතන (NIE) විෂය නිර්දේශයට අනුකූල බහුභාෂා AI ගුරු සහකරු වේ. සිසුන්ට සෘජු පිළිතුරු ලබා දීම වෙනුවට සක්‍රීය ඉගෙනීම සඳහා පියවරෙන් පියවර මඟ පෙන්වන්න.',
      template: (vars) => `සිසුවාගේ ප්‍රශ්නය: "${vars.query}"\nශ්‍රේණිය: ${vars.grade || 11}\nවිෂය ඒකකය: ${vars.topic || 'සාමාන්‍ය'}`,
    },
    'socratic_tutor:ta': {
      version: '1.0.0',
      system:
        'நீங்கள் StudyPal, இலங்கை தேசிய கல்வி நிறுவனம் (NIE) பாடத்திட்டத்துடன் இணைந்த AI ஆசிரியர். மாணவருக்கு நேரடியாக விடையை அளிக்காமல், படிப்படியாக வழிகாட்டும் வினாக்கள் மூலம் சிந்திக்கத் தூண்டுங்கள்.',
      template: (vars) => `மாணவரின் கேள்வி: "${vars.query}"\nவகுப்பு: ${vars.grade || 11}\nஅலகு: ${vars.topic || 'பொது'}`,
    },

    // Grounded Q&A
    'grounded_qa:en': {
      version: '1.0.0',
      system:
        'You are an authoritative curriculum assistant. Answer the student query STRICTLY using the provided context chunks from official Sri Lankan textbooks. If the answer is not present in the excerpts, declare uncertainty politely.',
      template: (vars) => `Context Excerpts:\n${vars.context}\n\nQuestion: ${vars.query}`,
    },
    'grounded_qa:si': {
      version: '1.0.0',
      system:
        'ලබා දී ඇති පෙළපොත් කොටස් පමණක් පදනම් කරගෙන පිළිතුරු සපයන්න. අදාළ පිටු අංක සඳහන් කරන්න. කරුණු අඩංගු නොවන්නේ නම් එය පැහැදිලිව සඳහන් කරන්න.',
      template: (vars) => `පෙළපොත් කොටස්:\n${vars.context}\n\nප්‍රශ්නය: ${vars.query}`,
    },
    'grounded_qa:ta': {
      version: '1.0.0',
      system:
        'வழங்கப்பட்ட பாடநூல் சான்றுகளை மட்டுமே அடிப்படையாகக் கொண்டு விடையளிக்கவும். பக்க எண்களைக் குறிப்பிடவும். விடை இல்லையெனில் அதைத் தெளிவாகக் கூறவும்.',
      template: (vars) => `பாடநூல் சான்றுகள்:\n${vars.context}\n\nகேள்வி: ${vars.query}`,
    },

    // Question Generation
    'question_gen:en': {
      version: '1.0.0',
      system:
        'You are an examination paper author for the Sri Lankan Department of Examinations. Generate high-quality multiple-choice questions (MCQs) with 4 plausible options, marking scheme, and detailed step-by-step explanations.',
      template: (vars) => `Generate ${vars.numQuestions || 5} questions for Grade ${vars.grade || 11} ${vars.subject || 'General'}.\nTopic: ${vars.topic}.\nDifficulty: ${vars.difficulty || 'MEDIUM'}.\nContext:\n${vars.context || ''}`,
    },
  };

  public getPrompt(task: AiTaskType, language: SupportedLanguage, vars: Record<string, any>): { system: string; user: string; version: string } {
    const key = `${task}:${language}`;
    const fallbackKey = `${task}:en`;
    const template = this.templates[key] || this.templates[fallbackKey] || this.templates['socratic_tutor:en'];

    return {
      system: template.system,
      user: template.template(vars),
      version: template.version,
    };
  }
}
