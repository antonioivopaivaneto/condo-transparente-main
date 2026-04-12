import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="border-border hover:shadow-lg transition-all duration-300 bg-card">
      <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 rounded-xl bg-accent/50 flex items-center justify-center">
          <img src={icon} alt={title} className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
