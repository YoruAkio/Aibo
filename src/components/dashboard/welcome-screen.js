import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Code, GraduationCap } from 'lucide-react';

// @note sample questions data
export const sampleQuestions = {
  Create: [
    'Buatkan cerita pendek tentang robot yang menemukan perasaan',
    'Buatkan rencana bisnis untuk kedai kopi dengan konsep eco-friendly',
    'Rancang konsep aplikasi mobile untuk belajar bahasa',
    'Berikan 5 ide kreatif untuk menulis novel fantasi',
  ],
  Explore: [
    'Jelaskan bagaimana cara kerja quantum computing dengan sederhana',
    'Apa saja tren terbaru dalam teknologi AI di tahun 2024?',
    'Jelaskan konsep metaverse dan dampaknya pada masa depan',
    'Sebutkan 5 sumber energi terbarukan yang paling efisien',
  ],
  Code: [
    'Jelaskan perbedaan antara var, let, dan const di JavaScript',
    'Buatkan contoh komponen React untuk menampilkan daftar tugas',
    'Jelaskan apa itu REST API dan berikan contoh penggunaannya',
    'Buatkan fungsi Python untuk mengurutkan array angka secara ascending',
  ],
  Learn: [
    'Jelaskan dasar-dasar machine learning untuk pemula',
    'Berikan 7 tips untuk meningkatkan kemampuan komunikasi',
    'Jelaskan strategi investasi yang aman untuk pemula',
    'Jelaskan proses fotosintesis dengan bahasa yang mudah dipahami',
  ],
};

// @note welcome screen with sample questions
export function WelcomeScreen({ activeTab, setActiveTab, onQuestionSelect }) {
  const categoryIcons = {
    Create: Sparkles,
    Explore: BookOpen,
    Code: Code,
    Learn: GraduationCap,
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        How can I help you?
      </h1>

      {/* @note category tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {Object.keys(sampleQuestions).map(category => {
          const Icon = categoryIcons[category];

          return (
            <Button
              key={category}
              onClick={() => setActiveTab(category)}
              variant="outline"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                activeTab === category
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{category}</span>
            </Button>
          );
        })}
      </div>

      {/* @note sample questions for active tab */}
      <div className="space-y-3 w-full max-w-lg">
        {sampleQuestions[activeTab].map((question, index) => (
          <Button
            key={index}
            onClick={() => onQuestionSelect(question)}
            variant="outline"
            className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors h-auto"
          >
            <span className="text-sm text-muted-foreground">{question}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
