import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-24 md:py-32 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-8 text-center">Refund Policy</h1>

                <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">1. Course Enrollment Refunds</h2>
                        <p>
                            We strive to provide the highest quality chemistry education. If you are not satisfied with a purchased course, you may request a refund within <strong>7 days</strong> of your purchase, provided you have not completed more than 20% of the course content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">2. Non-Refundable Items</h2>
                        <p>
                            Certain items and services are non-refundable:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Test Series and Mock Exams once attempted.</li>
                            <li>Downloadable digital resources (e.g., PDF notes) once downloaded.</li>
                            <li>Personalized coaching sessions that have already taken place or were missed without notice.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">3. Refund Process</h2>
                        <p>
                            To request a refund, please contact our support team at <a href="mailto:info@ruchiupadhyay.com" className="text-primary hover:underline">info@ruchiupadhyay.com</a> with your order details and the reason for the request.
                        </p>
                        <p className="mt-2">
                            Once your return is received and inspected, we will send you an email to notify you that we have received your request. We will also notify you of the approval or rejection of your refund.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">4. Late or Missing Refunds</h2>
                        <p>
                            If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next, contact your bank. There is often some processing time before a refund is posted.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">5. Contact Us</h2>
                        <p>
                            For any questions regarding refunds and returns, please contact us at: <a href="mailto:info@ruchiupadhyay.com" className="text-primary hover:underline">info@ruchiupadhyay.com</a>.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RefundPolicy;
