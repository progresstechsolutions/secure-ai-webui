import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Brain, FileText, Activity, Microscope, Shield } from "lucide-react"

export function FeatureCards() {
  const parentFeatures = [
    {
      icon: FileText,
      title: "Smart Health Records",
      description: "Organize medical records and get AI-powered insights for your family's health journey.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Activity,
      title: "Symptom Analysis",
      description: "Track symptoms and get instant, trusted medical guidance powered by AI.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ]

  const enterpriseFeatures = [
    {
      icon: Microscope,
      title: "Accelerated Research",
      description: "Speed up clinical research with AI-powered data analysis and pattern recognition.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Streamline FDA submissions with AI-assisted documentation and compliance tools.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-4">
              <Heart className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">For Families</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-foreground mb-4">Care made simple</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {parentFeatures.map((feature, index) => (
              <Card key={index} className="border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-serif">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">For Enterprise</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-foreground mb-4">Accelerate breakthroughs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {enterpriseFeatures.map((feature, index) => (
              <Card key={index} className="border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-serif">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                  <Button variant="outline" size="sm">
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
