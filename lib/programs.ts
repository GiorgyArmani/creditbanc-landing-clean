// Single source of truth for the funding programs. Used by both the homepage
// CircularGallery/modals (components/sections/Products.tsx) and the dedicated,
// crawlable category pages (/sba-loans, /real-estate-financing,
// /small-business-funding). Pure data — safe to import from server or client.

export interface Program {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  body: string;
  expanded: {
    intro: string;
    bullets: string[];
    bestFor: string;
  };
  image: string;
  imageAlt: string;
  popupImage?: string;
  popupImageMobile?: string;
}

export const PROGRAMS: Program[] = [
  {
    id: 'term-loans',
    icon: 'savings',
    title: 'Term Loans',
    tagline: 'Big capital. Longer runway. Fewer cash chokeholds.',
    body: 'A business term loan gives you access to a larger lump sum of capital with predictable monthly payments and longer repayment terms. Use it to expand, buy equipment, increase inventory, support payroll, refinance expensive debt, or make the kind of business move that needs more than a quick cash patch and a prayer.',
    expanded: {
      intro:
        'The goal is simple: get the capital you need, structure it in a way the business can actually handle, and avoid letting repayment become the next problem.',
      bullets: [
        'Up to $5 million in funding',
        'Terms up to 10 years',
        'Predictable monthly payments',
        'Competitive rate options based on the strength of the business',
        'Can be used for growth, working capital, equipment, or business debt consolidation',
      ],
      bestFor:
        'Established businesses that need more than a quick cash bandage. Term loans are a good fit when the goal is to stabilize cash flow, fund growth, refinance expensive short-term debt, or make a larger business investment without turning repayment into a full-contact sport.',
    },
    image: '/program%20cards/term%20loans.png',
    imageAlt: 'Term Loans',
    popupImage: '/program%20pop%20up%20image/Term%20Loans.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/Term%20Loan.png',
  },
  {
    id: 'equipment',
    icon: 'precision_manufacturing',
    title: 'Equipment Financing',
    tagline: 'Yes, the tractor’s sexy. The terms still matter.',
    body: 'Equipment financing helps business owners purchase or lease the equipment they need without draining working capital. New equipment, used equipment, heavy machinery, vehicles, tech, tools, production equipment — whatever keeps the business moving and the revenue coming in.',
    expanded: {
      intro:
        'Instead of tying up cash upfront, financing spreads the cost over time so the equipment can start earning its keep.',
      bullets: [
        'Up to $25 million in equipment financing for heavy equipment, vehicles, machinery, tech, and tools',
        'Terms up to 120 months',
        '100% financing options available',
        'New and used equipment may qualify',
        'Application-only options may be available for requests under $150,000',
      ],
      bestFor:
        'Businesses that need equipment to operate, grow, replace outdated assets, or take on bigger work without tying up cash upfront. Equipment financing makes sense when the equipment has a clear business purpose, and waiting to buy it would cost more than financing it properly.',
    },
    image: '/program%20cards/equipment%20financing.png',
    imageAlt: 'Equipment Financing',
    popupImage: '/program%20pop%20up%20image/equipment%20financing.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/Equipment.png',
  },
  {
    id: 'lines-of-credit',
    icon: 'credit_card',
    title: 'Lines of Credit',
    tagline: 'Use what you need. Pay for what you use. Imagine that.',
    body: 'A small business line of credit gives you access to flexible capital you can pull from when the business needs a little backup. Payroll timing gets weird. Inventory needs to be ordered. A vendor needs to be paid. A slow week shows up uninvited. A good opportunity pops up before the cash lands.',
    expanded: {
      intro:
        'That’s where a line of credit helps. You use what you need, when you need it, and pay interest only on what you actually draw. Wildly reasonable. We know.',
      bullets: [
        'Revolving credit lines up to $750,000',
        'Funding may be available in as little as 24 hours',
        'No collateral required for qualifying businesses',
        'Pay interest only on what you use',
        'Use it for payroll, inventory, vendor payments, short-term gaps, or working capital',
        'Unsecured business line of credit options may be available for qualifying businesses',
      ],
      bestFor:
        'Businesses that want flexible access to capital without taking the whole bag upfront. A line of credit makes sense when your cash needs come and go, because business expenses have a real talent for showing up before the money does.',
    },
    image: '/program%20cards/lines%20of%20credit.png',
    imageAlt: 'Lines of Credit',
    popupImage: '/program%20pop%20up%20image/LOC.png',
    popupImageMobile: '/program%20pop%20up%20image/pop%20up%20mobile/LOC.png',
  },
  {
    id: 'accounts-receivable',
    icon: 'receipt_long',
    title: 'Accounts Receivable Factoring',
    tagline: 'Get paid now. Let the invoice age somewhere else.',
    body: 'Accounts receivable factoring, also called invoice factoring, helps turn unpaid invoices into working capital without waiting 30, 60, or 90 days for customers to finally remember money is part of the arrangement.',
    expanded: {
      intro:
        'Instead of taking on a traditional loan, you can factor eligible invoices and receive a portion of the invoice amount upfront. That cash can help cover payroll, materials, vendor payments, operating expenses, new projects, or the delightful little gap between “work completed” and “payment received.”',
      bullets: [
        'Advance rates up to 90% of eligible invoices',
        'Funding may be available in as little as 48 hours',
        'Choose which invoices you want to factor',
        'Often easier to qualify for than traditional financing',
        'Useful for covering payroll, materials, vendors, operations, or new work',
      ],
      bestFor:
        'Businesses that invoice customers but have to wait weeks or months to get paid. Factoring makes sense when revenue is there on paper, but cash is stuck in limbo, and the business still has real expenses due right now. Because unfortunately, payroll does not accept “the client said they’ll send it next week” as legal tender. (If only.)',
    },
    image: '/program%20cards/accounts%20receivable%20factoring.png',
    imageAlt: 'Accounts Receivable Factoring',
    popupImage: '/program%20pop%20up%20image/AR%20Factoring.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/AR%20Factoring.png',
  },
  {
    id: 'ecommerce-funding',
    icon: 'shopping_cart',
    title: 'eCommerce Funding',
    tagline: 'Growth capital without handing over the keys to the store.',
    body: 'eCommerce funding through the Credit Banc and onRamp partnership helps online businesses access capital for inventory, marketing, fulfillment, cash flow, platform growth, and the expensive little realities of selling things on the internet.',
    expanded: {
      intro:
        'Instead of giving up equity or getting buried under high-fee financing, this program helps online brands get the money they need to keep moving, restock faster, test new channels, or scale without inviting a stranger onto the cap table.',
      bullets: [
        'Funding up to $2 million',
        'Funds may be available in as little as 24 hours',
        'No equity dilution',
        'Built for online sellers and eCommerce brands',
        'Can be used for inventory, marketing, fulfillment, operations, or growth',
      ],
      bestFor:
        'eCommerce businesses with real sales momentum that need cash to keep the machine moving. Inventory has to be ordered. Ads have to run. Fulfillment has to happen. Customers do not care that your cash is somewhere between Stripe, Shopify, and a warehouse invoice. The goal is to keep growth moving without turning the business into a fee machine for someone else.',
    },
    image: '/program%20cards/ecommerce%20funding.png',
    imageAlt: 'eCommerce Funding',
    popupImage: '/program%20pop%20up%20image/ecommerce%20funding.png',
    popupImageMobile: '/program%20pop%20up%20image/pop%20up%20mobile/eComm.png',
  },
  {
    id: 'inventory-financing',
    icon: 'inventory_2',
    title: 'Inventory Financing',
    tagline: 'Stock the shelves without starving the cash flow.',
    body: 'Inventory financing helps businesses buy the products, materials, or goods they need before those items turn into sales. It can be useful when demand is picking up, busy season is coming, supplier pricing is favorable, or one big order is about to put your cash flow in a headlock.',
    expanded: {
      intro:
        'Good inventory planning means having enough product to meet demand without draining the money needed for payroll, rent, vendors, marketing, and all the other bills that remain deeply committed to showing up.',
      bullets: [
        'Funding to purchase inventory, materials, products, or goods for resale',
        'Can help prepare for busy seasons, large orders, growth periods, or supplier deadlines',
        'Useful when inventory must be purchased before revenue is collected',
        'May help preserve cash for payroll, rent, vendors, marketing, and operating expenses',
        'Structure depends on business strength, inventory type, sales history, and repayment ability',
      ],
      bestFor:
        'Retailers, wholesalers, e-commerce brands, manufacturers, seasonal businesses, and other inventory-heavy companies that need to buy before they sell. Inventory financing can help keep shelves stocked without letting one purchase order shove the rest of the business into a broom closet.',
    },
    image: '/program%20cards/inventory%20financing.png',
    imageAlt: 'Inventory Financing',
    popupImage: '/program%20pop%20up%20image/inventory%20financing.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/Inventory.png',
  },
  {
    id: 'merchant-cash-advance',
    icon: 'bolt',
    title: 'Merchant Cash Advance',
    tagline: 'Fast capital, with the fine print taken seriously.',
    body: 'A merchant cash advance is not a traditional loan. It is an advance against future revenue, which can make it faster and easier to access than other types of financing. That speed can be useful when timing matters. But it also comes with tradeoffs. Shorter repayment windows, higher costs, and frequent payments can put real pressure on cash flow if the structure does not fit the business.',
    expanded: {
      intro:
        'At Credit Banc, we look at merchant cash advances carefully. Sometimes they are the right tool. Sometimes MCAs are just the fastest way to make an expensive problem worse.',
      bullets: [
        'Up to $5 million in working capital',
        'Funding may be available in as little as 24 hours',
        'Terms up to 18 months',
        'Based largely on business revenue and deposits',
        'May be available to a wide range of industries',
      ],
      bestFor:
        'Businesses that need fast access to capital and understand the cost, timing, and repayment structure before moving forward. An MCA may make sense for a short-term opportunity, urgent need, or revenue-backed situation where speed matters and the cash flow can support it. It does not make sense as the default answer every time a business owner needs money. That is how too many companies end up stacking expensive debt and wondering why their bank account feels like it has a leak.',
    },
    image: '/program%20cards/mca.png',
    imageAlt: 'Merchant Cash Advance',
    popupImage: '/program%20pop%20up%20image/MCA.png',
    popupImageMobile: '/program%20pop%20up%20image/pop%20up%20mobile/MCA.png',
  },
  {
    id: 'rental-property',
    icon: 'apartment',
    title: 'Rental Property Loans',
    tagline: 'Portfolio capital that doesn’t faint at your tax return.',
    body: 'Rental property loans help real estate investors finance income-producing properties based largely on the cash flow of the property itself. That can mean less reliance on personal income documentation and a lending structure built around the deal, the rent roll, and whether the property can actually support the debt.',
    expanded: {
      intro:
        'Because if the property can support the debt, the conversation should start there.',
      bullets: [
        'Loans up to $25 million',
        'Up to 80% loan-to-value',
        'Cash flow-based lending',
        'No tax returns required in many cases',
        '30-year fixed-rate and interest-only options may be available',
        '1–4 family and multifamily properties may qualify',
        'Foreign nationals may be eligible',
      ],
      bestFor:
        'Real estate investors who want to buy, refinance, or grow a rental portfolio without forcing every deal through traditional personal-income underwriting. This can work well for seasoned operators, newer investors with a strong property, foreign nationals investing in U.S. real estate, or anyone building a portfolio where the numbers on the property matter more than the bank’s outdated checklist.',
    },
    image: '/program%20cards/rental%20property%20loans.png',
    imageAlt: 'Rental Property Loans',
    popupImage: '/program%20pop%20up%20image/Rental%20Property.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/Rental%20Property.png',
  },
  {
    id: 'commercial-mortgage',
    icon: 'domain',
    title: 'Commercial Mortgage Loans',
    tagline: 'For properties too complex for copy-paste lending.',
    body: 'Commercial mortgage loans help business owners and real estate investors finance, refinance, build, or reposition commercial property through commercial real estate loan options built around the deal. That may include office buildings, retail space, warehouses, self-storage, multifamily properties, mixed-use developments, owner-occupied real estate, construction projects, bridge needs, and larger commercial deals that require a more thoughtful structure.',
    expanded: {
      intro:
        'Because commercial real estate is not one-size-fits-all. The property, use, timeline, cash flow, and exit plan all matter. Anyone pretending otherwise is probably trying to shove your deal into whatever product they happen to sell.',
      bullets: [
        'Options for commercial real estate, multifamily, mixed-use, construction, bridge, CMBS, agency, and mezzanine financing',
        'Access to a network of 100+ lending partners',
        'Owner-occupied commercial real estate options may be available, including SBA-backed structures',
        'Financing available for purchases, refinances, construction, repositioning, and portfolio needs',
        'Advisor support to help compare structures, terms, tradeoffs, and lender fit',
      ],
      bestFor:
        'Business owners and real estate investors financing commercial property that needs more than a generic loan quote. This can work for owner-occupied properties, multifamily assets, mixed-use developments, warehouses, retail, office, self-storage, construction projects, bridge scenarios, or deals where the structure matters just as much as the rate. Commercial real estate has too many moving parts for lazy financing. The right loan should match the property, the plan, and the way the deal actually makes money.',
    },
    image: '/program%20cards/commercial%20mortgage.png',
    imageAlt: 'Commercial Mortgage Loans',
    popupImage: '/program%20pop%20up%20image/commercial%20mortgage.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/SBA%20Commerical%20Mortgage.png',
  },
  {
    id: 'hard-money',
    icon: 'speed',
    title: 'Hard Money Loans',
    tagline: 'Capital for real estate deals that cannot wait for a committee meeting.',
    body: 'Hard money loans give real estate investors fast, asset-based financing for acquisitions, bridge needs, property stabilization, and value-add projects. Instead of relying heavily on traditional income documentation, the structure is built around the property, the deal, the equity, and the exit plan.',
    expanded: {
      intro:
        'This is not meant to be forever money. It is short-term capital for investors who need to move quickly, secure the property, execute the plan, and either refinance, sell, or stabilize into a better long-term structure.',
      bullets: [
        'Loans up to $20 million',
        'Up to 70% loan-to-value, with ARV considered when applicable',
        'Fast closings, sometimes in as little as two weeks',
        'Interest-only options may be available',
        'Can be used across rental, multifamily, office, retail, industrial, self-storage, mobile home parks, and other real estate assets',
      ],
      bestFor:
        'Real estate investors who need speed, flexibility, and a loan structure based more on the asset than the usual bank checklist. Hard money can make sense for acquisitions, bridge financing, stabilization, value-add projects, or deals where timing matters and the exit plan is clear. It’s also a program where structure matters a lot. Fast capital can help you win the deal. Bad fast capital can make the deal wish it had never met you. (Don’t worry. Your Credit Banc Advisor is here to keep that from happening.)',
    },
    image: '/program%20cards/hard%20money.png',
    imageAlt: 'Hard Money Loans',
    popupImage: '/program%20pop%20up%20image/Hard%20Money.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/Hard%20Money.png',
  },
  {
    id: 'fix-and-flip',
    icon: 'construction',
    title: 'Fix-and-Flip Loans',
    tagline: 'Buy the ugly property. (Just don’t let the financing make it uglier.)',
    body: 'Fix-and-flip loans help real estate investors purchase and renovate properties with short-term financing built around the project, the budget, and the exit plan. Use it for rental homes, multifamily properties, commercial real estate, or value-add projects where the plan is to renovate, sell, refinance, or stabilize the property.',
    expanded: {
      intro:
        'The right financing gives you room to move quickly, fund the work, and avoid tying up too much cash before the project has a chance to prove itself.',
      bullets: [
        'Loan amounts from $250,000 to $20 million',
        'Up to 85% of after-repair value',
        'Up to 90% loan-to-cost',
        '12-month interest-only options may be available',
        'Can be used for rental homes, multifamily properties, commercial properties, and renovation projects',
      ],
      bestFor:
        'Investors who see the upside in a rough property and need capital to move before the opportunity disappears. Fix-and-flip loans make sense when the renovation budget is clear, the timeline is realistic, and the exit plan doesn’t rely on crossed fingers and a hot market.',
    },
    image: '/program%20cards/fix%20and%20flip.png',
    imageAlt: 'Fix-and-Flip Loans',
    popupImage: '/program%20pop%20up%20image/fix%20and%20flip.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/Fix%20and%20Flip.png',
  },
  {
    id: 'ground-up-construction',
    icon: 'engineering',
    title: 'Ground-Up Construction Loans',
    tagline: 'Dirt is cheap. Building on it is not.',
    body: 'Ground-up construction loans help real estate investors, developers, and business owners finance new construction projects from the ground up. That can include land acquisition, site development, and vertical construction, all structured around the project, budget, timeline, and exit plan.',
    expanded: {
      intro:
        'Use it for single-family rental builds, multifamily projects, commercial real estate, or owner-user construction where the plan is bigger than “buy it and fix it.” New construction has more moving parts, which is exactly why the financing needs to be built around the full project, not just the purchase price.',
      bullets: [
        'Loans up to $50 million',
        'Up to 85% loan-to-cost',
        'Land acquisition, site development, and vertical construction may be included',
        'Interest-only draw schedules may be available',
        'Can be used for single-family rentals, multifamily, commercial real estate, and business-use properties',
      ],
      bestFor:
        'Projects where the opportunity is solid, but the capital needs to cover more than just the build. Land, site development, construction costs, and draw timing all matter here, which is why ground-up financing works best for borrowers who already know what they’re building, why it makes sense, and how the project gets paid off.',
    },
    image: '/program%20cards/ground%20up%20construction.png',
    imageAlt: 'Ground-Up Construction Loans',
    popupImage: '/program%20pop%20up%20image/Ground%20Up%20Construction.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/Ground%20Up%20Construction.png',
  },
  {
    id: 'project-financing',
    icon: 'foundation',
    title: 'Project Financing',
    tagline: 'Big project. Big moving parts. Better have the money lined up.',
    body: 'Project financing helps cover the upfront costs tied to a specific job, contract, buildout, expansion, or revenue-producing project. Use it for materials, labor, deposits, equipment, vendor costs, mobilization, production, or the expensive little details that tend to show up before the revenue does.',
    expanded: {
      intro:
        'The right structure helps match the funding to the project timeline, so a good opportunity does not turn into a cash flow migraine with paperwork.',
      bullets: [
        'Funding for specific projects, contracts, or business opportunities',
        'Can help cover upfront costs before revenue is collected',
        'Useful for buildouts, expansion, materials, labor, production, or project-based growth',
        'Structure depends on project size, timeline, revenue potential, and business strength',
        'May help preserve working capital while the project is underway',
      ],
      bestFor:
        'Businesses with a real project on the table and a clear path to revenue. Project financing can make sense when the opportunity is solid, but the upfront costs would put too much pressure on cash flow. Because “we’ll figure it out as we go” is not a funding strategy. It is a dare.',
    },
    image: '/program%20cards/Project%20Financing.png',
    imageAlt: 'Project Financing',
    popupImage: '/program%20pop%20up%20image/project%20financing.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/Project%20Financing.png',
  },
  {
    id: 'sba-flexfund',
    icon: 'rocket_launch',
    title: 'FlexFund Program',
    tagline: 'Good things come in small (funding) packages.',
    body: 'FlexFund is built for business owners who need a practical amount of capital without turning the whole process into a three-act drama. Use it for equipment, repairs, marketing, hiring, inventory, cash flow gaps, or a smaller business move that still needs to get done.',
    expanded: {
      intro:
        'The point is simple: get useful capital in the door, keep the payment manageable, and avoid borrowing more than the situation actually calls for.',
      bullets: [
        'Loan amounts from $15,000 to $50,000',
        'Funding in 10 days or less',
        'Terms up to 10 years',
        'Monthly payments',
        'Minimum FICO of 640',
      ],
      bestFor:
        'Business owners with a specific need that is too important to ignore, but not big enough for a massive financing package. FlexFund is a fit when the business needs a clean, manageable way to handle the next move without overborrowing or settling for short-term money with an attitude problem.',
    },
    image: '/program%20cards/flexfund.png',
    imageAlt: 'FlexFund Program',
    popupImage: '/program%20pop%20up%20image/FlexFund.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/FlexFund.png',
  },
  {
    id: 'sba-refinance',
    icon: 'sync',
    title: 'SBA Loan Refinance',
    tagline: 'Your SBA loan might be due for a rate intervention.',
    body: 'An SBA loan refinance can help business owners replace an existing SBA 7(a) loan with a cleaner, better-priced structure. The goal is to lower the monthly payment, improve cash flow, and possibly pull out additional working capital. This may make sense if your current SBA loan is priced at Prime + 3.5% or higher.',
    expanded: {
      intro:
        'Refinancing could help move that loan into a lower-rate SBA structure, reset the term, and give the business more room to work with. Just because a loan made sense when you signed it does not mean it gets a lifetime pass.',
      bullets: [
        'Designed for existing SBA 7(a) loans',
        'Current loan typically must be priced at Prime + 3.5% or higher',
        'New rate options may include Prime + 1% fixed or Prime + 1.25% variable',
        'Loan term may reset to 10 or 25 years, depending on the structure',
        'Requires full underwriting, including business and global DSCR of 1.15x',
        'Three years of financials may be required',
      ],
      bestFor:
        'Business owners with an SBA loan that may be costing more than it should. SBA refinancing makes sense when the goal is to reduce monthly payments, free up cash flow, access additional working capital, or finally ask the very reasonable question: “Why the hell are we still paying it like this?”',
    },
    image: '/program%20cards/sba%20refinance.png',
    imageAlt: 'SBA Loan Refinance',
    popupImage: '/program%20pop%20up%20image/SBA%20Refinance.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/SBA%20Refinancing.png',
  },
  {
    id: 'sba-commercial-real-estate',
    icon: 'business',
    title: 'SBA Commercial Real Estate Loans',
    tagline: 'Commercial property financing for owners ready to stop renting forever.',
    body: 'SBA commercial real estate loans help business owners buy, refinance, renovate, or build owner-occupied commercial property with longer terms and, in some cases, up to 100% financing. Office, warehouse, retail, mixed-use, medical, industrial, or other commercial property may qualify, as long as the business occupies enough of the space to meet SBA requirements.',
    expanded: {
      intro:
        'Owning is not always the right move. But if the numbers work, it is nice when the monthly payment builds your balance sheet instead of your landlord’s.',
      bullets: [
        'SBA 7(a) and SBA 504 options may be available',
        'Financing may be available up to $10 million',
        'Terms up to 25 years',
        'Up to 100% financing may be available for qualifying businesses',
        'Business must typically occupy at least 51% of the rentable square footage',
        'SBA 7(a): minimum FICO may start around 640',
        'SBA 504: minimum FICO may start around 660',
        'Can be used for commercial real estate purchase, refinance, renovation, ground-up construction, or heavy machinery',
      ],
      bestFor:
        'Business owners who want to own the property their business operates from and use the space as a long-term asset. SBA commercial real estate financing makes sense when the goal is to preserve cash, build equity, control the property, lease out unused square footage, or finally stop asking a landlord for permission to improve the building you’re already paying for.',
    },
    image: '/program%20cards/sba%20commercial%20real%20estate.png',
    imageAlt: 'SBA Commercial Real Estate Loans',
    popupImage: '/program%20pop%20up%20image/SBA%20Commerical%20Real%20Estate.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/SBA%20Commercial%20Real%20Estate.png',
  },
  {
    id: 'sba-business-acquisition',
    icon: 'handshake',
    title: 'SBA Business Acquisition Loans',
    tagline: 'Buy the business. Skip the “starting from scratch” headaches.',
    body: 'SBA business acquisition loans help qualified buyers purchase an existing business with longer repayment terms, competitive SBA-backed rates, and, in some cases, little to no money down. This can be used to buy an established business, acquire a franchise, purchase business assets, include working capital, finance equipment, cover inventory, fund renovations, or even buy owner-occupied commercial real estate as part of the deal.',
    expanded: {
      intro:
        'The business still has to make sense on paper. Profitability matters. Buyer experience matters. The numbers have to support the loan. Shocking, we know. But that is also what keeps “I bought a business” from turning into “I bought myself a very expensive job.”',
      bullets: [
        'SBA acquisition financing may be available with as little as 0% down',
        'Loan terms may range from 10 to 25 years',
        'Financing may be available up to $10 million with combined SBA and conventional structures',
        'Minimum FICO may start around 640',
        'The business being purchased must show enough profitability to support repayment',
        'Buyer typically needs relevant or transferable industry experience',
        'Business plan and financial projections required',
      ],
      bestFor:
        'Buyers who want to purchase a business with history, revenue, customers, and systems already in place. SBA acquisition financing makes sense when the deal can support the debt, the buyer can run the business, and the purchase price is grounded in a little thing we like to call “reality”.',
    },
    image: '/program%20cards/sba%20business%20acquisition.png',
    imageAlt: 'SBA Business Acquisition Loans',
    popupImage: '/program%20pop%20up%20image/sba%20business%20acquisition.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/SBA%20Acquisition.png',
  },
  {
    id: 'sba-startup',
    icon: 'lightbulb',
    title: 'SBA Startup Loans',
    tagline: 'Startup capital for people with a plan, not just a pretty pitch deck.',
    body: 'SBA startup loans help qualified entrepreneurs launch a new business with longer repayment terms and SBA-backed financing. Funds may be used for working capital, equipment, inventory, renovations, leasehold improvements, or owner-occupied commercial real estate.',
    expanded: {
      intro:
        'This is not “I had an idea in the shower” money. SBA startup financing usually requires relevant experience, a strong business plan, financial projections, and enough borrower investment to show the lender you are not just emotionally committed.',
      bullets: [
        'Funding from $100,000 up to $5 million',
        'Terms may range from 10 to 25 years',
        'As little as 10% equity injection may be required',
        'Minimum FICO start at 700',
        'Funds may be used for working capital, inventory, equipment, renovations, leasehold improvements, or owner-occupied commercial real estate',
        'Strong business plan and financial projections required',
        'Transferable experience matters. A lot.',
        'Available collateral may strengthen the application',
      ],
      bestFor:
        'Entrepreneurs who are ready to start a business and have more than blind enthusiasm carrying the deal. SBA startup financing makes sense when the borrower has relevant experience, a clear plan, realistic projections, and enough capital invested to show they are serious. A good idea helps. A plan that survives basic math helps more.',
    },
    image: '/program%20cards/sba%20startup.png',
    imageAlt: 'SBA Startup Loans',
    popupImage: '/program%20pop%20up%20image/SBA%20Startup.png',
    popupImageMobile:
      '/program%20pop%20up%20image/pop%20up%20mobile/SBA%20Startup.png',
  },
];

// Marketing interest tags, keyed by program id. When a visitor opens a program
// modal/page and clicks "Check Eligibility", we carry this tag to /apply-now so
// it rides along into the GHL form submission and lands on the contact. Edit the
// right-hand strings to rename a tag; they are written to GHL verbatim.
export const PROGRAM_INTEREST_TAG: Record<string, string> = {
  'term-loans': 'interested: term loans',
  equipment: 'interested: equipment financing',
  'lines-of-credit': 'interested: lines of credit',
  'accounts-receivable': 'interested: accounts receivable factoring',
  'ecommerce-funding': 'interested: ecommerce funding',
  'inventory-financing': 'interested: inventory financing',
  'merchant-cash-advance': 'interested: merchant cash advance',
  'rental-property': 'interested: rental property loans',
  'commercial-mortgage': 'interested: commercial mortgage loans',
  'hard-money': 'interested: hard money loans',
  'fix-and-flip': 'interested: fix and flip loans',
  'ground-up-construction': 'interested: ground-up construction',
  'project-financing': 'interested: project financing',
  'sba-flexfund': 'interested: flexfund program',
  'sba-refinance': 'interested: SBA refinance',
  'sba-commercial-real-estate': 'interested: SBA commercial real estate',
  'sba-business-acquisition': 'interested: SBA acquisition',
  'sba-startup': 'interested: SBA startup',
};

const BY_ID = new Map(PROGRAMS.map((p) => [p.id, p]));

// Higher-resolution 1080x1350 (4:5) program art for the category pages. The
// homepage gallery keeps the smaller `image` cards. Keyed by program id; any
// program without an entry (e.g. sba-business-acquisition) falls back to its
// `image`. Filenames are URL-encoded to survive the spaces.
const HIRES_CARD: Record<string, string> = {
  'term-loans': '/program%20images/Term%20Loan.png',
  equipment: '/program%20images/equipment%20financing.png',
  'lines-of-credit': '/program%20images/LOC.png',
  'accounts-receivable': '/program%20images/AR%20Factoring.png',
  'ecommerce-funding': '/program%20images/ecommerce%20funding.png',
  'inventory-financing': '/program%20images/inventory%20financing.png',
  'merchant-cash-advance': '/program%20images/MCA.png',
  'rental-property': '/program%20images/Rental%20Property.png',
  'commercial-mortgage': '/program%20images/commercial%20mortgage.png',
  'hard-money': '/program%20images/Hard%20Money.png',
  'fix-and-flip': '/program%20images/fix%20and%20flip.png',
  'ground-up-construction': '/program%20images/Ground%20Up%20Construction.png',
  'project-financing': '/program%20images/project%20financing.png',
  'sba-flexfund': '/program%20images/FlexFund.png',
  'sba-refinance': '/program%20images/SBA%20Refinancing.png',
  'sba-commercial-real-estate':
    '/program%20images/SBA%20Commerical%20Real%20Estate.png',
  'sba-business-acquisition':
    '/program%20images/SBA%20Business%20Acquisition.png',
  'sba-startup': '/program%20images/SBA%20Startup.png',
};

/** Hi-res 4:5 card art for the category pages; falls back to the gallery card. */
export function programCardImage(p: Program): string {
  return HIRES_CARD[p.id] ?? p.image;
}

/** "Check Eligibility" link for a program — carries the interest tag to GHL. */
export function applyHref(programId: string): string {
  const qs = new URLSearchParams();
  const tag = PROGRAM_INTEREST_TAG[programId];
  if (tag) qs.set('interest', tag);
  qs.set('appointment_source', programId);
  return `/apply-now?${qs.toString()}`;
}

export interface ProgramCategory {
  /** URL slug AND the route path, e.g. 'sba-loans' → /sba-loans. */
  slug: 'sba-loans' | 'real-estate-financing' | 'small-business-funding';
  /** Homepage anchor that opens this category's section in the gallery. */
  homeAnchor: 'sba' | 'real-estate' | 'small-business';
  navLabel: string;
  eyebrow: string;
  /** H1 — split is up to the page. */
  title: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  /** schema.org Service serviceType. */
  serviceType: string;
  /** Program ids in display order. */
  programIds: string[];
}

export const CATEGORIES: ProgramCategory[] = [
  {
    slug: 'sba-loans',
    homeAnchor: 'sba',
    navLabel: 'SBA Financing',
    eyebrow: 'SBA Financing',
    title: 'SBA Loans & Government-Backed Financing',
    intro:
      'Government-backed financing for working capital, acquisitions, owner-occupied real estate, refinancing, and startup costs. Built for bigger business moves, longer timelines, and financing needs that usually deserve more structure than a short-term cash grab.',
    metaTitle:
      'SBA Loans: 7(a), 504, Acquisition, Real Estate & Refinance | Credit Banc',
    metaDescription:
      'Compare SBA 7(a) and 504 financing for business acquisition, owner-occupied commercial real estate, startups, and SBA refinance. Terms up to 25 years, with one-on-one Advisor guidance from Credit Banc.',
    serviceType: 'SBA loan',
    programIds: [
      'sba-flexfund',
      'sba-refinance',
      'sba-commercial-real-estate',
      'sba-business-acquisition',
      'sba-startup',
    ],
  },
  {
    slug: 'real-estate-financing',
    homeAnchor: 'real-estate',
    navLabel: 'Real Estate Financing',
    eyebrow: 'Real Estate Financing',
    title: 'Real Estate Financing',
    intro:
      'Real estate financing for investors and owners. Capital for rentals, flips, construction, commercial property, and investor deals where the structure needs to match the asset, not fight it.',
    metaTitle:
      'Real Estate Financing: Rental, Fix-and-Flip, Hard Money & Commercial | Credit Banc',
    metaDescription:
      'Real estate financing for investors and owners: rental property loans, fix-and-flip, ground-up construction, hard money, and commercial mortgages. Cash-flow-based options with Advisor support from Credit Banc.',
    serviceType: 'Commercial real estate loan',
    programIds: [
      'rental-property',
      'commercial-mortgage',
      'hard-money',
      'fix-and-flip',
      'ground-up-construction',
    ],
  },
  {
    slug: 'small-business-funding',
    homeAnchor: 'small-business',
    navLabel: 'Small Business Funding',
    eyebrow: 'Small Business Funding',
    title: 'Small Business Funding',
    intro:
      'Small business funding and working capital for everyday needs, growth plans, and the expensive realities of running a company. Funding options for payroll, inventory, equipment, expansion, vendor payments, cash flow gaps, and the other things that make business ownership such a relaxing little hobby.',
    metaTitle:
      'Small Business Funding: Term Loans, Lines of Credit & Equipment | Credit Banc',
    metaDescription:
      'Small business funding and working capital: term loans, equipment financing, lines of credit, invoice factoring, inventory, eCommerce, and project financing. Fast approvals with Advisor guidance from Credit Banc.',
    serviceType: 'Small business loan',
    programIds: [
      'term-loans',
      'equipment',
      'lines-of-credit',
      'accounts-receivable',
      'ecommerce-funding',
      'inventory-financing',
      'merchant-cash-advance',
      'project-financing',
    ],
  },
];

export function getCategory(
  slug: string,
): ProgramCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function programsForCategory(cat: ProgramCategory): Program[] {
  return cat.programIds
    .map((id) => BY_ID.get(id))
    .filter((p): p is Program => Boolean(p));
}
