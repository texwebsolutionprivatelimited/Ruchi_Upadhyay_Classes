import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-24 md:py-32 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-8 text-center">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            At Ruchi Upadhyay Classes, we collect distinct types of information to improve your learning experience:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal Information:</strong> Includes your name, email address, phone number, and profile details provided during registration.</li>
                            <li><strong>Usage Data:</strong> Information on how you access and use our courses, tests, and platform features.</li>
                            <li><strong>Device Information:</strong> Technical data about your device, browser, and internet connection.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                        <p>We use the collected data for various purposes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To provide and maintain our educational services.</li>
                            <li>To notify you about changes to our courses or platform.</li>
                            <li>To allow you to participate in interactive features like tests and leaderboards.</li>
                            <li>To provide customer support and respond to your inquiries.</li>
                            <li>To monitor the usage of our platform and detect technical issues.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">3. Data Security</h2>
                        <p>
                            The security of your data is important to us. We use commercially acceptable means to protect your Personal Information, but remember that no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">4. Third-Party Services</h2>
                        <p>
                            We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">5. Changes to This Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:info@ruchiupadhyay.com" className="text-primary hover:underline">info@ruchiupadhyay.com</a>.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
