import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy & Terms of Service — Credit Banc',
  description:
    'Privacy Policy and Terms of Service for Credit Banc. Read the legal terms that govern your use of creditbanc.io.',
  alternates: { canonical: '/privacypolicy' },
  openGraph: {
    title: 'Privacy Policy & Terms of Service | Credit Banc',
    description:
      'The legal terms that govern your use of creditbanc.io and Credit Banc services.',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 bg-surface text-on-surface">
        {/* Hero */}
        <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16">
          <div
            aria-hidden
            className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative max-w-4xl mx-auto">
            <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary mb-4">
              Legal
            </p>
            <h1 className="font-headline text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tighter text-white leading-[0.95] mb-5">
              Privacy Policy &amp;{' '}
              <span className="text-primary">Terms of Service</span>
            </h1>
            <p className="text-base md:text-lg text-white/85 leading-relaxed max-w-2xl">
              The legal terms that govern your use of{' '}
              <span className="text-primary font-semibold">creditbanc.io</span>{' '}
              and the products and services offered by Credit Banc.
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="px-6 sm:px-8 py-12 sm:py-16">
          <article className="max-w-3xl mx-auto space-y-10 text-on-surface leading-relaxed">
            <Intro />

            <Section title="Intellectual Property Rights">
              <SubSection title="Our Limited License to You">
                <p>
                  This Site and all the materials accessible on the Site are the
                  property of us as well as our members or licensors, and are
                  secured by copyright, brand name, and other protected
                  innovation laws. The Site is given exclusively to your own
                  noncommercial use. You may not utilize the Site or the
                  materials accessible on the Site in a way that establishes an
                  encroachment of our privileges or that has not been approved
                  by us. All the more explicitly, except if expressly approved
                  in these Terms of Service or by the proprietor of the
                  materials, you may not change, duplicate, replicate,
                  republish, transfer, post, communicate, decipher, sell, make
                  subsidiary works, abuse, or disseminate in any way or medium
                  (counting by email or other electronic methods) any material
                  from the Site. You may, in any case, every now and then,
                  download as well as print one duplicate of individual pages of
                  the Site for your own, non-business use, given that you keep
                  flawless all copyright and other restrictive takes note.
                </p>
              </SubSection>

              <SubSection title="Your License to Us">
                <p>
                  By posting or presenting any material (counting, without
                  restriction, remarks, blog passages, Facebook postings,
                  photographs and recordings) to us by means of the Site, web
                  gatherings, web-based social networking scenes, or to any of
                  our staff by means of email, text or else, you are speaking
                  to: (I) that you are the proprietor of the material, or are
                  making your posting or accommodation with the express assent
                  of the proprietor of the material; and (ii) that you are
                  thirteen years old or more established. What&rsquo;s more,
                  when you submit, email, message or convey or post any
                  material, you are giving us, and anybody approved by us, a
                  sovereignty free, interminable, unalterable, non-elite,
                  unhindered, overall permit to utilize, duplicate, alter,
                  communicate, sell, abuse, make subordinate works from,
                  circulate, or potentially openly perform or show such
                  material, in entire or to some degree, in any way or medium,
                  presently known or in the future created, for any reason. The
                  previous award will remember the option to misuse any
                  exclusive rights for such posting or accommodation, including,
                  yet not constrained to, rights under copyright, brand name,
                  administration imprint or patent laws under any important
                  purview. Additionally, regarding the activity of such rights,
                  you award us, and anybody approved by us, the option to
                  distinguish you as the creator of any of your postings or
                  entries by name, email address or screen name, as we esteem
                  fitting.
                </p>
                <p>
                  You recognize and concur that any commitments initially made
                  by you for us will be considered a &ldquo;work made
                  available&rdquo; when the work performed is inside the extent
                  of the meaning of a work made available in Section 101 of the
                  United States Copyright Law, as altered. All things
                  considered, the copyrights in those works will have a place
                  with COMPANY from their creation. In this manner, COMPANY will
                  be esteemed the creator and selective proprietor thereof and
                  will reserve the option to abuse any or the entirety of the
                  outcomes and continues in all media, presently known or in the
                  future contrived, all through the universe, in ceaselessness,
                  in all dialects, as COMPANY decides. If any of the outcomes
                  and continues of your entries hereunder are not regarded a
                  &ldquo;work made available&rdquo; under Section 101 of the
                  Copyright Act, as changed, you thusly, without extra pay,
                  unavoidably relegate, pass on and move to COMPANY every single
                  restrictive right, including without confinement, all
                  copyrights and brand names all through the universe, in
                  interminability in each medium, regardless of whether
                  presently known or from this point forward contrived, to such
                  material and all right, title and enthusiasm for and to all
                  such exclusive rights in each medium, whether currently known
                  or in the future formulated, all through the universe, in
                  ceaselessness. Any posted material which are multiplications
                  of earlier works by you will be co-claimed by us.
                </p>
                <p>
                  You recognize that COMPANY has the privilege yet not the
                  commitment to utilize and show any postings or commitments of
                  any sort and that COMPANY may choose to stop the utilization
                  and show off any such materials (or any bit thereof), whenever
                  in any way, shape or form.
                </p>
              </SubSection>

              <SubSection title="Restrictions on Linking and Framing">
                <p>
                  You may build up a hypertext connection to the Site since the
                  connection does not state or suggest any sponsorship of your
                  site by us or by the Site. In any case, you may not, without
                  our earlier composed consent, outline or inline connect any of
                  the substance of the Site or join into another site or other
                  assistance any of our material, substance or licensed
                  innovation.
                </p>
              </SubSection>
            </Section>

            <Section title="Disclaimers">
              <p>
                All through the Site, we may give connections and pointers to
                Internet destinations kept up by outsiders. Our connecting to
                such outsider destinations does not suggest a support or
                sponsorship of such locales, or the data, items or
                administrations offered on or through the locales. Furthermore,
                neither we nor members work or control in any regard any data,
                items or administrations that outsiders may give on or through
                the Site or on sites connected to by us on the Site.
              </p>
              <p>
                On the off chance that material, any feelings, guidance,
                proclamations, administrations, offers, or other data or
                substance communicated or made accessible by outsiders,
                including data suppliers, are those of the separate creators or
                wholesalers, and not COMPANY. Neither COMPANY nor any outsider
                supplier of data ensures the exactness, culmination, or value of
                any substance. Besides, COMPANY neither supports nor is
                answerable for the exactness and dependability of any
                supposition, exhortation, or articulation made on any of the
                Sites by anybody other than an approved COMPANY agent while
                acting in his/her official limit.
              </p>
              <p className="uppercase text-on-surface-variant">
                The information, products and services offered on or through the
                Site and by Company and any third-party Sites are provided
                &ldquo;with no guarantees&rdquo; and without warranties of any
                kind either express or implied. To the fullest extent
                permissible pursuant to applicable law, we disclaim all
                warranties, express or implied, including, but not limited to,
                implied warranties of merchantability and fitness for a
                particular purpose. We do not warrant that the Site or any of
                its functions will be uninterrupted or error-free, that defects
                will be corrected, or that any part of this Site, including
                bulletin boards, or the servers that make it available, are free
                of viruses or other harmful components.
              </p>
              <p className="uppercase text-on-surface-variant">
                We do not warrant or make any representations regarding the use
                or the results of the use of the Site or materials on this Site
                or on third-party Sites in terms of their correctness, accuracy,
                timeliness, reliability or otherwise.
              </p>
              <p>
                You concur consistently to safeguard, reimburse and hold
                innocuous COMPANY its offshoots, their replacements,
                transferees, appointees and licensees and their separate parent
                and auxiliary organizations, specialists, partners, officials,
                chiefs, investors and representatives of each from and against
                all cases, reasons for activity, harms, liabilities, expenses
                and costs, including lawful charges and costs, emerging out of
                or identified with your break of any commitment, guarantee,
                portrayal or contract put forward in this.
              </p>
            </Section>

            <Section title="Online Commerce">
              <p>
                Certain areas of the Site may permit you to buy various sorts of
                items and administrations online that are given by outsiders. We
                are not liable for the quality, precision, practicality,
                unwavering quality or some other part of these items and
                administrations. On the off chance that you make a buy from a
                dealer on the Site or on a website connected to by the Site, the
                data got during your visit to that trader&rsquo;s online store
                or webpage, and the data that you give as a component of the
                exchange, for example, your Visa number and contact data, might
                be gathered by both the shipper and us. A vendor may have
                security and information assortment rehearses that are not the
                same as our own. We have no obligation or risk for these free
                strategies. Also, when you buy items or administrations on or
                through the Site, you might be dependent upon extra terms and
                conditions that explicitly apply to your buy or utilization of
                such items or administrations. For more data with respect to a
                vendor, its online store, its protection arrangements, and
                additionally any extra terms and conditions that may apply,
                visit that shipper&rsquo;s site and snap on its data connections
                or contact the trader straightforwardly. You discharge us and
                our members from any harms that you acquire, and make a deal to
                avoid stating any cases against us or them, emerging from your
                buy or utilization of any items or administrations made
                accessible by outsiders through the Site.
              </p>
              <p>
                Your support, correspondence or professional interactions with
                any outsider found on or through our Site, in regards to
                installment and conveyance of explicit products and ventures,
                and some other terms, conditions, portrayals or guarantees
                related with such dealings, are exclusively among you and such
                outsider. You concur that COMPANY will not be capable or subject
                for any misfortune, harm, or different issues of any kind
                brought about as the consequence of such dealings.
              </p>
              <p>
                You consent to be monetarily liable for all buys made by you or
                somebody following up for your sake through the Site. You
                consent to utilize the Site and to buy administrations or items
                through the Site for genuine, non-business purposes as it were.
                You additionally make a deal to avoid making any buys for
                theoretical, bogus or false purposes or to envision interest for
                a specific item or administration. You consent to just buy
                products or administrations for yourself or for someone else for
                whom you are lawfully allowed to do as such. When making a buy
                for an outsider that expects you to present the outsider&rsquo;s
                very own data to us or a shipper, you speak to that you have
                gotten the express assent of such outsider to give such
                outsider&rsquo;s very own data.
              </p>
              <p>
                Your buy is for individual utilize as it were. Sharing of buys
                is not allowed and will be viewed as unapproved, an encroaching
                utilization of our copyrighted material, and may expose
                violators to liability. If installment for a course is declined,
                our framework will consequently handicap access to our top notch
                materials. (We comprehend. This typically happens since a
                Mastercard lapses.) We need to help reestablish your entrance,
                so we will reach you to help settle this issue. When the
                charging issue is settled, we will reestablish it.
              </p>
            </Section>

            <Section title="Interactive Features">
              <p>
                This Site may incorporate an assortment of highlights, for
                example, announcement loads up, web logs, visit rooms, and email
                administrations, which permit input to us and continuous
                collaboration among clients, and different highlights which
                permit clients to speak with others. Duty regarding what is
                posted on announcement sheets, web logs, visit rooms, and other
                open posting zones on the Site, or sent by means of any email
                administrations on the Site, lies with every client &mdash; only
                you are liable for the material you post or send. We do not
                control the messages, data or documents that you or others may
                give through the Site. It is a state of your utilization of the
                Site that you do not:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                <li>
                  Limit or hinder some other client from utilizing and getting a
                  charge out of the Site.
                </li>
                <li>
                  Utilize the Site to imitate any individual or substance, or
                  erroneously state or in any case distort your connection with
                  an individual or element.
                </li>
                <li>
                  Meddle with or disturb any workers or systems used to give the
                  Site or its highlights, or resist any necessities, methodology,
                  approaches or guidelines of the systems we use to give the
                  Site.
                </li>
                <li>
                  Utilize the Site to prompt or urge others to submit criminal
                  operations or cause injury or property harm to any individual.
                </li>
                <li>
                  Increase unapproved access to the Site, or any record, PC
                  framework, or system associated with this Site, by means, for
                  example, hacking, secret word mining or other unlawful
                  methods.
                </li>
                <li>
                  Acquire or endeavor to get any materials or data through any
                  methods not purposefully made accessible through this Site.
                </li>
                <li>
                  Utilize the Site to post or communicate any unlawful,
                  compromising, damaging, hostile, abusive, foul, disgusting,
                  obscene, profane or revolting data of any sort, including
                  without restriction any transmissions comprising or
                  empowering conduct that would establish a criminal offense,
                  offer ascent to common obligation or in any case disregard any
                  neighborhood, state, national or worldwide law.
                </li>
                <li>
                  Utilize the Site to post or send any data, programming or
                  other material that abuses or encroaches upon the privileges
                  of others, including material that is an intrusion of
                  security or exposure rights or that is ensured by copyright,
                  brand name or other restrictive right, or subordinate works
                  with deference thereto, without first acquiring consent from
                  the proprietor or rights holder.
                </li>
                <li>
                  Utilize the Site to post or send any data, programming or
                  other material that contains an infection or other hurtful
                  part.
                </li>
                <li>
                  Utilize the Site to post, send or in any capacity abuse any
                  data, programming or other material for business purposes, or
                  that contains publicizing.
                </li>
                <li>
                  Utilize the Site to publicize or request to anybody to
                  purchase or sell items or administrations, or to make gifts of
                  any sort, without our express composed endorsement.
                </li>
                <li>
                  Accumulate for showcasing purposes any email addresses or
                  other individual data that has been posted by different
                  clients of the Site.
                </li>
              </ul>
              <p>
                Organization may have message sheets, visits and other open
                gatherings on its Sites. Any client neglecting to conform to the
                terms and states of this Agreement might be ousted from and
                rejected proceeded with access to, the message sheets, talks or
                other open gatherings later on. Organization or its assigned
                operators may evacuate or change any client made substance
                whenever under any circumstances. Message sheets, visits and
                other open gatherings are expected to fill in as conversation
                places for clients and endorsers. Data and substance posted
                inside these open gatherings might be given by COMPANY staff,
                COMPANY&rsquo;s outside givers, or by clients not associated
                with COMPANY, some of whom may utilize mysterious client names.
                Organization explicitly repudiates all duty and support and
                makes no portrayal with respect to the legitimacy of any
                sentiment, exhortation, data or proclamation made or showed in
                these gatherings by outsiders, nor are we answerable for any
                mistakes or exclusions in such postings, or for hyperlinks
                implanted in any messages. By no means will we, our partners,
                providers or specialists be subject for any misfortune or harm
                brought about by your dependence on data got through these
                gatherings. The assessments communicated in these gatherings are
                exclusively the assessments of the members, and don&rsquo;t
                mirror the assessments of COMPANY or any of its auxiliaries or
                partners.
              </p>
              <p>
                Organization has no commitment at all to screen any of the
                substance or postings on the message sheets, talk rooms or other
                open gatherings on the Sites. Be that as it may, you recognize
                and concur that we have indisputably the option to screen the
                equivalent at our sole attentiveness. What&rsquo;s more, we
                maintain all authority to adjust, alter, decline to post or
                expel any postings or substance, in entire or to a limited
                extent, in any way, shape or form and to unveil such materials
                and the conditions encompassing their transmission to any
                outsider so as to fulfill any relevant law, guideline, lawful
                procedure or legislative solicitation and to secure ourselves,
                our customers, patrons, clients and guests.
              </p>
              <p>
                We once in a while incorporate access to an online network as a
                major aspect of our projects. We need each and every part to
                increase the value of the gathering. We will probably make your
                locale the most important network you&rsquo;re an individual
                from. Subsequently, we maintain all authority to evacuate anybody
                whenever. We once in a while do this, yet we need to tell you
                how genuinely we take our networks.
              </p>
            </Section>

            <Section title="Registration">
              <p>
                To get to specific highlights of the Site, we may request that
                you give certain segment data including your sexual orientation,
                year of birth, postal division and nation. What&rsquo;s more, on
                the off chance that you choose for pursue a specific component
                of the Site, for example, talk rooms, web logs, or notice
                sheets, you may likewise be approached to enlist with us on the
                structure gave and such enrollment may expect you to give by and
                by recognizable data, for example, your name and email address.
                You consent to give valid, exact, current and complete data
                about yourself as incited by the Site&rsquo;s enlistment
                structure. On the off chance that we have sensible grounds to
                presume that such data is false, erroneous, or inadequate, we
                reserve the privilege to suspend or end your record and decline
                all current or future utilization of the Site (or any part
                thereof). Our utilization of any actually recognizable data you
                give to us as a major aspect of the enlistment procedure is
                administered by the conditions of our Privacy Policy.
              </p>
            </Section>

            <Section title="Password">
              <p>
                To utilize certain highlights of the Site, you will require a
                username and secret key, which you will get through the
                Site&rsquo;s enrollment procedure. You are answerable for
                keeping up the secrecy of the secret phrase and account, and are
                liable for all exercises (regardless of whether by you or by
                others) that happen under your secret phrase or record. You
                consent to inform us quickly of any unapproved utilization of
                your secret key or account or some other break of security, and
                to guarantee that you exit from your record toward the finish of
                every meeting. We can&rsquo;t and won&rsquo;t be at risk for any
                misfortune or harm emerging from your inability to ensure your
                secret key or account data.
              </p>
            </Section>

            <Section title="Restriction of Liability">
              <p className="uppercase text-on-surface-variant">
                By no means, including, but not limited to, negligence, shall
                we, our subsidiary and parent companies or affiliates be liable
                for any direct, indirect, incidental, special or consequential
                damages that result from the use of, or the inability to use,
                the Site, including our messaging, blogs, comments of others,
                books, emails, products, or services, or third-party materials,
                products, or services made available through the Site or by us
                in any way, even if we are advised beforehand of the possibility
                of such damages. (Since some states do not allow the exclusion
                or limitation of certain categories of damages, the above
                limitation may not apply to you. In such states, our liability
                and the liability of our subsidiary and parent companies or
                affiliates is limited to the fullest extent permitted by such
                state law.) You specifically acknowledge and agree that we are
                not liable for any defamatory, offensive or illegal conduct of
                any user. On the off chance that you are dissatisfied with the
                Site, any materials, products, or services on the Site, or with
                any of the Site&rsquo;s terms and conditions, your sole and
                exclusive remedy is to discontinue using the Site and the
                products, services and/or materials.
              </p>
              <p className="uppercase text-on-surface-variant">
                Organization is not an investment advisory service, is not an
                investment adviser, tax firm and does not provide personalized
                financial advice or tax advice or act as a financial advisor.
              </p>
              <p className="uppercase text-on-surface-variant">
                We exist for educational purposes only, and the materials and
                information contained herein and in our products and services
                are for general informational purposes only. None of the
                information provided by us is intended as investment, tax,
                accounting or legal advice, as an offer or solicitation of an
                offer to buy or sell, or as an endorsement, recommendation or
                sponsorship of any company, security, or fund. Our information
                should not be relied upon for purposes of transacting in
                securities or other investments.
              </p>
              <p className="uppercase text-on-surface-variant">
                We do not offer or provide tax, legal or investment advice and
                you are responsible for consulting tax, legal, or financial
                professionals before acting on any information provided by us.
              </p>
              <p className="uppercase text-on-surface-variant">
                This Site is continually under development and Company makes no
                warranty of any kind, implied or express, as to its accuracy,
                completeness or appropriateness for any purpose.
              </p>
              <p className="uppercase text-on-surface-variant">
                You recognize and concurs that no portrayal has been made by
                Company or its affiliates and depended upon with respect to the
                future pay, costs, deals volume or potential productivity that
                might be gotten from the cooperation in this program.
              </p>
            </Section>

            <Section title="Termination">
              <p>
                We may drop or end your entitlement to utilize the Site or any
                piece of the Site whenever without notice. In case of wiping out
                or end, you are not, at this point approved to get to the piece
                of the Site influenced by such crossing out or end. The
                limitations forced on you as for material downloaded from the
                Site, and the disclaimers and constraints of liabilities set out
                in these Terms of Service, will endure.
              </p>
            </Section>

            <Section title="Refund Policy">
              <p>
                Advanced items bought don&rsquo;t offer any discounts. All deals
                are conclusive. Acquisition of a pass to a Live occasion might
                be credited towards a future occasion in such situations where
                something emerges and you are not, at this point ready to go to
                the particular occasion for which you enlisted.
              </p>
            </Section>

            <Section title="Other (DMCA)">
              <p>
                The Digital Millennium Copyright Act of 1998 (the &ldquo;DMCA&rdquo;)
                gives a plan of action to copyright proprietors who accept that
                material showing up on the Internet encroaches on their
                privileges under the U.S. copyright law. On the off chance that
                you put stock in accordance with some basic honesty that
                materials facilitated by COMPANY encroach your copyright, you,
                or your operator may send to COMPANY a notification mentioning
                that the material be evacuated or access to it be blocked. Any
                notice by a copyright proprietor or an individual approved to
                follow up for its benefit that neglects to consent to
                prerequisites of the DMCA will not be viewed as adequate
                notification and will not be regarded to give upon COMPANY
                genuine information on realities or conditions from which
                encroaching material or acts are obvious. On the off chance that
                you have confidence in accordance with some basic honesty that a
                notification of copyright encroachment has been wrongly
                documented against you, the DMCA grants you to send to COMPANY a
                counter-notice. All notification and counter notification must
                meet the then current legal necessities forced by the DMCA; see{' '}
                <a
                  href="http://www.loc.gov/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  http://www.loc.gov/copyright
                </a>{' '}
                for subtleties. Organization&rsquo;s Copyright Agent for notice
                of cases of copyright encroachment or counter notification can
                be reached as follows:{' '}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {SITE.email}
                </a>
                .
              </p>
              <p>
                This Agreement will be official upon and acclimate to the
                advantage of COMPANY and our particular doles out, replacements,
                beneficiaries, and legitimate agents. Neither this Agreement nor
                any rights hereunder might be relegated without the earlier
                composed assent of COMPANY. Despite the previous, all rights and
                commitments under this Agreement might be unreservedly allocated
                by COMPANY to any partnered substance or any of its entirely
                claimed auxiliaries.
              </p>
              <p>
                These Terms of Use will be administered by and understood as per
                the laws of the State of Florida and any question will be liable
                to restricting intervention in Orlando, Florida. On the off
                chance that any arrangement of this understanding will be
                unlawful, void or in any way, shape or form unenforceable, at
                that point that arrangement will be regarded severable from this
                understanding and will not influence the legitimacy and
                enforceability of any residual arrangements.
              </p>
            </Section>

            <Section title="Disclaimer">
              <p>
                In spite of the fact that it is profoundly improbable, This
                policy may be changed at any time at our discretion. If we
                should update this policy, we will post the updates to this page
                on our Website.
              </p>
              <p>
                In the event that you have any inquiries or concerns with
                respect to our protection strategy please direct them to:{' '}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {SITE.email}
                </a>
                .
              </p>
            </Section>

            <div className="border-t border-outline-variant/40 pt-8 text-sm text-on-surface-variant">
              <p>© 2024 creditbanc.io</p>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Intro() {
  return (
    <div className="space-y-4 border-b border-outline-variant/40 pb-8">
      <p>
        This site (the &ldquo;Site&rdquo;) is possessed and worked by Credit
        Banc (&ldquo;COMPANY,&rdquo; &ldquo;we&rdquo; or &ldquo;us&rdquo;). By
        utilizing the Site, you consent to be limited by these Terms of Service
        and to utilize the Site as per these Terms of Service, our Privacy
        Policy and any extra terms and conditions that may apply to explicit
        areas of the Site or to items and administrations accessible through
        the Site or from COMPANY. Getting to the Site, in any way, regardless
        of whether computerized or something else, comprises utilization of the
        Site and your consent to be limited by these Terms of Service.
      </p>
      <p>
        We maintain whatever authority is needed to change these Terms of
        Service or to force new conditions on utilization of the Site, every
        now and then, wherein we will post the overhauled Terms of Service on
        this site. By proceeding to utilize the Site after we post any such
        changes, you acknowledge the Terms of Service, as altered.
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-secondary-fixed">
        {title}
      </h2>
      <div className="space-y-4 text-on-surface leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-headline text-lg md:text-xl font-bold tracking-tight text-on-secondary-fixed mt-4">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
