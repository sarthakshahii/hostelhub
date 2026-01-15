import { ArrowRight, Lightbulb } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PlaceholderPage = ({
  title,
  description,
  icon,
}: PlaceholderPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8 p-6 rounded-2xl bg-primary/10">
        <div className="w-20 h-20 text-primary">{icon}</div>
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        {description}
      </p>
      <div className="bg-card border border-border rounded-xl p-8 max-w-2xl">
        <div className="flex items-start gap-4 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div className="text-left">
            <h3 className="font-bold text-foreground mb-2">Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              This module is ready for implementation. Let me know what features
              you'd like to build here, and I'll implement them for you.
            </p>
          </div>
        </div>
        <button className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          Continue Development
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
