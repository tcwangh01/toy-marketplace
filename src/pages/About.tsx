import * as Sentry from "@sentry/react";
import NavigationBar from "@/components/NavigationBar";

const AboutContent = () => {
  const triggerTestError = () => {
    Sentry.captureException(new Error("Test error from About page"));
    throw new Error("Test error from About page");
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />

      <main className="px-[var(--page-padding)] py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-display font-medium text-foreground mb-4">
            About Marketplace
          </h1>
          <p className="text-body text-foreground mb-4">
            Marketplace is your trusted platform for buying and selling authentic pre-owned products.
          </p>
          <p className="text-body text-foreground mb-6">
            We connect sellers with buyers in a safe, secure environment where quality and authenticity are guaranteed.
          </p>
          <button
            onClick={triggerTestError}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90"
          >
            Trigger Test Error
          </button>
        </div>
      </main>
    </div>
  );
};

const About = Sentry.withErrorBoundary(AboutContent, {
  fallback: (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-6">
        <h2 className="text-xl font-medium text-foreground mb-2">Something went wrong</h2>
        <p className="text-muted-foreground">This error has been reported to Sentry.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          Reload page
        </button>
      </div>
    </div>
  ),
});

export default About;
