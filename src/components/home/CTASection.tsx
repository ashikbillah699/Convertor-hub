import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoMark from "@/assets/opticthirst-mark.png";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-16 text-center">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <img src={logoMark} alt="OpticThirst logo" className="h-10 w-10 object-contain" />
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join millions of users who trust OpticThirst for their file
              conversion needs. 100% free, no signup required.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-xl"
                asChild
              >
                <Link to="/tools">
                  Start Converting Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-primary-foreground hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
