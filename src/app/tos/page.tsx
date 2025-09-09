import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Terms of Use/Service",
  description: "Terms of use/service for the VidDown website. Please read carefully before using our website.",
  alternates: { canonical: "https://api.massdatagh.com/tos" },
};

export default function TermsPage() {
  return (
    <main className="container-2xl pb-16">
      {/* Sponsored link and ad scripts */}
      <div className="sr-only" aria-hidden>
        <a href="https://www.revenuecpmgate.com/jpw10pkrz?key=ed1f05d49ba2bc493efeeaa4e7ff63b0" rel="nofollow noopener noreferrer" target="_blank">
          Sponsored
        </a>
      </div>
      <Script
        src="//pl27597134.revenuecpmgate.com/2f/b6/49/2fb64931b441b74d110320a45b067ce6.js"
        strategy="afterInteractive"
        id="rev-cpmgate-pl27597134"
      />
      <Script id="hpformat-atoptions" strategy="afterInteractive">
        {`
          atOptions = {
            key: 'a4427b44894f9b851e4eb349cba19972',
            format: 'iframe',
            height: 50,
            width: 320,
            params: {}
          };
        `}
      </Script>
      <Script
        src="//www.highperformanceformat.com/a4427b44894f9b851e4eb349cba19972/invoke.js"
        strategy="afterInteractive"
        id="hpformat-invoke"
      />
      <section className="prose prose-zinc max-w-3xl dark:prose-invert mx-auto px-4 sm:px-6 py-8 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
        <div className="mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-700">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">Terms of use/service for the VidDown Website</h1>
          <p className="mt-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400">Please read this carefully before using our website.</p>
          <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-md border-l-4 border-indigo-500">
            <p className="text-zinc-700 dark:text-zinc-300">
              The website VidDown (referred to as "the Website") is designed for the sole purpose of facilitating video
              downloads for testing and personal use only. By accessing and using this Website, you agree to comply with
              the terms and conditions set forth in this disclaimer.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-3">1</span>
            Intended Use
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            The Website is intended solely for legitimate purposes, such as educational, research, or personal use. You
            may use the Website to download videos from sources that permit downloading, provided that you adhere to all
            relevant copyright and intellectual property laws.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-3">2</span>
            Prohibited Uses
          </h2>
          <ul className="mt-3 space-y-4">
            <li className="flex">
              <div className="flex-shrink-0 pt-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">a.</span>
                </span>
              </div>
              <p className="ml-3 text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Copyright Infringement:</span> You are strictly prohibited from using this Website to
                download copyrighted content without the explicit permission of the content owner. The Website does not
                endorse or condone any form of copyright infringement.
              </p>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 pt-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">b.</span>
                </span>
              </div>
              <p className="ml-3 text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Illegal Activities:</span> Any use of the Website for illegal activities, including but not
                limited to downloading content that violates local, national, or international laws, is strictly
                prohibited. Users engaging in illegal activities will be solely liable for their actions.
              </p>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 pt-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">c.</span>
                </span>
              </div>
              <p className="ml-3 text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Distribution of Downloaded Content:</span> You may not distribute, share, or sell the
                downloaded content obtained from this Website for commercial purposes or in any manner that would infringe
                upon the rights of the content owner.
              </p>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-3">3</span>
            User Responsibility
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            You, the user, are solely responsible for any consequences resulting from your use of the Website. This
            includes legal repercussions that may arise from any unauthorized downloading or distribution of copyrighted
            material. You are also responsible for ensuring that your usage complies with all applicable laws and
            regulations.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-3">4</span>
            No Guarantee of Availability
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            The Website may not always be available, and we reserve the right to suspend or terminate its operation at
            any time without notice. We are not responsible for any loss of data or content resulting from the use of the
            Website.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-3">5</span>
            Disclaimer of Liability
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            The Website and its operators shall not be held liable for any direct or indirect damages, losses, or
            consequences resulting from the use of this Website. Users agree to use the Website at their own risk.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-3">6</span>
            User Liability for Illegal Activities
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            Users engaging in illegal activities, including copyright infringement or any other violations of the law,
            will be solely liable for their actions. The Website shall not be responsible or held accountable for any such
            activities.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-3">7</span>
            Changes to the Disclaimer
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            We reserve the right to modify this disclaimer at any time without prior notice. It is your responsibility to
            review this disclaimer periodically for any updates or changes.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-3">8</span>
            Contact Information
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            If you have any questions or concerns about this disclaimer or the use of the Website, please contact the
            owner using the contact info listed on <a href="https://scottlarry.org" target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">scottlarry.org</a>.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
            <p className="text-zinc-700 dark:text-zinc-300 font-medium">
              By using the Website, you acknowledge that you have read, understood, and agree to abide by the terms and
              conditions outlined in this disclaimer. If you do not agree with these terms, please refrain from using the
              Website.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
