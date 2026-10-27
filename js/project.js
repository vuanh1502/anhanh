(function () {
  'use strict';

  var root = document.documentElement;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  /* ---------- project data ----------
     Screens are 2x exports of the Figma content frames. Sizes are the natural
     pixel size of each file, used to reserve space while the images load.
     A screen is one of:
       img       a single image
       sections  cards whose screens scroll sideways; tabs: true turns the
                 captions into pills that jump to their screen; steps: true
                 draws the step timeline; half: true pairs two cards per row;
                 tall: true shows one long page in a scrolling frame
       (see sectionCard for the card kinds: switch, tabs, clusters) */
  var DIR = 'assets/projects/';
  var PROJECTS = [
    {
      key: 'wikex',
      name: 'Wikex',
      title: 'Wikex Exchange',
      accent: '#f9bb3a',
      logo: ['wikex', 476, 106],
      intro: 'Wikex Exchange is a centralized cryptocurrency exchange (CEX) built and developed in Vietnam. The UI and branding are designed to be clean, simple, and modern with yellow theme.',
      field: 'Trading Platform',
      tabs: [
        { label: 'Web design', slug: 'web', subs: [
          { label: 'Overview', sections: [
            { title: 'Landing page', tall: true, items: [['overview', 3245, 12071]] }
          ] },
          { label: 'Spot', sections: [
            { tabs: true, items: [['spot1-a1', 1684, 999, 'Market'], ['spot1-a2', 1496, 999, 'Limit'], ['spot1-a3', 1496, 999, 'Spot Limit'], ['spot1-a4', 1123, 998, 'Popup'], ['spot1-a5', 1684, 999, 'Depth chart'], ['spot1-a6', 1496, 999, 'Coin Info'], ['spot1-a7', 1496, 999, 'Order history']] },
            { label: 'Responsive', tabs: true, items: [['spot2-a1', 750, 1624, 'Spot mobile responsive - Unlogin case'], ['spot2-a2', 750, 1624, 'Spot mobile responsive - login case'], ['spot2-a3', 750, 1624, 'Depth Chart'], ['spot2-a4', 750, 1624, 'Order book'], ['spot2-a5', 750, 1624, 'Market Trade'], ['spot2-a6', 750, 1624, 'Coin Info'], ['spot3-a1', 750, 1624, 'Search'], ['spot3-a2', 750, 1624, 'Limit Buy Popup'], ['spot3-a3', 750, 1624, 'Limit Sell Popup'], ['spot3-a4', 750, 1624, 'Limit TP/SL Buy Popup'], ['spot3-a5', 750, 1624, 'Limit TP/SL Sell Popup'], ['spot3-a6', 750, 1624, 'Market Popup'], ['spot3-a7', 750, 1624, 'Stop-limit Popup']] }
          ] },
          { label: 'Profile', sections: [
            { tabs: true, items: [['profile1-a1', 1600, 1354, 'Profile Overview'], ['profile1-a2', 1600, 1354, 'Security Center'], ['profile1-a3', 1600, 1354, 'Identification'], ['profile1-a4', 1600, 1354, 'Referral'], ['profile1-a5', 1600, 1354, 'Setting']] },
            { label: 'Responsive', tabs: true, items: [['profile2-a1', 750, 1624, 'Profile Overview'], ['profile2-a2', 750, 1624, 'Security Center'], ['profile2-a3', 750, 1624, 'Identification'], ['profile2-a4', 750, 1624, 'Referral'], ['profile2-a5', 750, 1624, 'Setting']] }
          ] },
          { label: 'Wallet', sections: [
            { tabs: true, items: [['wallet1-a1', 1600, 1354, 'Wallet Overview'], ['wallet1-a2', 1600, 1354, 'Wallet Spot'], ['wallet1-a3', 1600, 1354, 'Wallet DEX'], ['wallet1-a4', 1600, 1354, 'Wallet Fiat'], ['wallet1-a5', 1600, 1354, 'Spot PNL Analysis'], ['wallet1-a6', 1600, 1354, 'Funding History']] },
            { label: 'Responsive', tabs: true, items: [['wallet2-a1', 750, 1624, 'Wallet Overview'], ['wallet2-a2', 750, 1624, 'Wallet Spot'], ['wallet2-a3', 750, 1624, 'Spot PNL Analysis'], ['wallet2-a4', 750, 1624, 'Funding History'], ['wallet2-a5', 750, 1624, 'Setting']] }
          ] },
          { label: 'Deposit / Withdraw', sections: [
            { switch: [
              { label: 'Deposit - 3 step', steps: true, items: [['dep1-a1', 1600, 1138, 'Step 1'], ['dep1-a2', 1600, 1138, 'Step 2'], ['dep1-a3', 1600, 1138, 'Step 3']] },
              { label: 'Withdraw - 3 step', steps: true, items: [['dep2-a1', 1600, 1138, 'Step 1'], ['dep2-a2', 1600, 1138, 'Step 2'], ['dep2-a3', 1600, 1138, 'Step 3']] }
            ] },
            { title: 'Responsive', steps: true, clusters: [
              { title: 'Deposit Responsive - 3 step', items: [['dep3-a1', 492, 1433, 'Step 1'], ['dep3-a2', 489, 1433, 'Step 2'], ['dep3-a3', 491, 1433, 'Step 3']] },
              { title: 'Withdraw Responsive - 3 step', items: [['dep4-a1', 492, 1432, 'Step 1'], ['dep4-a2', 492, 1442, 'Step 2'], ['dep4-a3', 492, 1437, 'Step 3']] }
            ] }
          ] },
          { label: 'Sign In/Sign Up', sections: [
            { switch: [
              { label: 'Sign Up', steps: true, items: [['sign-up1', 1600, 952, 'Sign up by Email/Phone Number'], ['sign-up2', 1600, 952, 'Verification Code'], ['sign-up3', 1600, 952, 'Create Password']] },
              { label: 'Sign In', steps: true, items: [['sign-in1', 1600, 952, 'Sign In by Email/Phone Number'], ['sign-in2', 1600, 952, 'Verification Code'], ['sign-in3', 1600, 952, 'Welcome aboard']] }
            ] },
            { label: 'Responsive', tabs: true, items: [['sign-upr1', 492, 1066, 'Sign up by Email/Phone Number'], ['sign-upr2', 492, 1066, 'Sign Up Verification Code'], ['sign-upr3', 492, 1066, 'Create Password'], ['sign-inr1', 492, 1066, 'Sign In by Email/Phone Number'], ['sign-inr2', 492, 1066, 'Sign In Verification Code'], ['sign-inr3', 492, 1066, 'Welcome aboard']] },
            { label: 'Reset Login Password', tabs: true, items: [['sign-reset1', 1652, 930, 'Reset by enter email/phone number'], ['sign-reset2', 1652, 936, 'Reset Login Password']] },
            { label: 'Reset Login Password Responsive', tabs: true, items: [['sign-resetr1', 750, 1624, 'Reset by enter email/phone number'], ['sign-resetr2', 750, 1624, 'Verification Code'], ['sign-resetr3', 750, 1624, 'Reset new Password'], ['sign-resetr4', 750, 1624, 'Reset new Password Text-Filled']] }
          ] },
          { label: 'KYC', sections: [
            { switch: [
              { label: 'KYC - Document Verification', steps: true, items: [['kyc-doc1', 1600, 952, 'Get verified to secure your account'], ['kyc-doc2', 1600, 952, 'Document Verification'], ['kyc-doc3', 1600, 952, 'Upload your ID document'], ['kyc-doc4', 1600, 952, 'Upload your ID document']] },
              { label: 'KYC - Liveness Check', steps: true, items: [['kyc-live1', 1600, 952, 'Verify with Current Device'], ['kyc-live2', 1600, 952, 'Liveness Check'], ['kyc-live3', 1600, 952, 'Liveness Check Successful'], ['kyc-live4', 1600, 952, 'Liveness Check Unsuccessful']] }
            ] },
            { label: 'Responsive', tabs: true, items: [['kyc-docr1', 492, 1066, 'Get verified to secure your account'], ['kyc-docr2', 492, 1066, 'Document Verification'], ['kyc-docr3', 492, 1066, 'Upload your ID document'], ['kyc-liver1', 492, 1066, 'Liveness Check'], ['kyc-liver2', 492, 1066, 'Liveness Check Successful'], ['kyc-liver3', 492, 1066, 'Liveness Check Unsuccessful']] },
            { label: 'Advanced KYC - Web', tabs: true, items: [['kycadv-1', 1652, 1068, 'Confirm Information'], ['kycadv-2', 1652, 1068, 'Under Review']] },
            { label: 'Advanced KYC - Responsive', tabs: true, items: [['kycadv-3', 750, 1624, 'Confirm Information - Step 1'], ['kycadv-4', 750, 1624, 'Confirm Information - Step 2'], ['kycadv-5', 750, 1624, 'Confirm Information - Step 3'], ['kycadv-6', 750, 1624, 'Under Review']] }
          ] }
        ] },
        { label: 'Mobile design', slug: 'mobile', subs: [
          { label: 'Home and User Center', sections: [{ base: 3144, switch: [
            { label: 'Home', imgs: [['mhome-a1', 1548, 2302]] },
            { label: 'Market', imgs: [['mhome-a2', 1548, 2302]] },
            { label: 'User Center - Main page', imgs: [['mhome-a3', 3144, 1680]] },
            { label: 'User Center - Setting Pages', imgs: [['mhome-a4', 3144, 1680]] }
          ] }] },
          { label: 'Trade', sections: [{ base: 3144, switch: [
            { label: 'Spot Trade full design', imgs: [['mtrade-a1', 3232, 2367]] },
            { label: 'Coin Info', imgs: [['mtrade-a2', 2412, 2368]] },
            { label: 'Spot Trade', imgs: [['mtrade-a3', 1592, 2078]] },
            { label: 'Limit TP/SL', imgs: [['mtrade-a4', 1592, 2077]] },
            { label: 'Limit Margin On', imgs: [['mtrade-a5', 772, 2078]] },
            { label: 'Market', imgs: [['mtrade-a6', 772, 2078]] },
            { label: 'Futures', imgs: [['mtrade-a7', 772, 2078]] },
            { label: 'Order book display', imgs: [['mtrade-a8', 1252, 938]] },
            { label: 'Other Popup', imgs: [['mtrade-a9', 1676, 930]] }
          ] }] },
          { label: 'Wallet & Deposit', sections: [{ base: 3144, switch: [
            { label: 'Wallet', imgs: [['mwallet-a1', 3144, 1680]] },
            { label: 'Deposit', imgs: [['mwallet-a2', 3144, 1680]] }
          ] }] },
          { label: 'Sign In/Sign Up', sections: [{ base: 3144, switch: [
            { label: 'Sign Up', imgs: [['msign-a1', 3144, 1680]] },
            { label: 'Sign In with Passkey', imgs: [['msign-a2', 3144, 1680]] }
          ] }] }
        ] },
        { label: 'Design System', slug: 'design-system', sections: [
          { tabs: true, items: [['ds-1', 848, 1138, 'Color'], ['ds-2', 986, 1190, 'Component Base'], ['ds-3', 1060, 1156, 'Button'], ['ds-4', 596, 1074, 'Icon'], ['ds-5', 1600, 846, 'Typography']] }
        ] },
        { label: 'CMS', slug: 'cms', sections: [
          { tabs: true, items: [['cms-a1', 1600, 1190, 'Dashboard'], ['cms-a2', 1600, 1190, 'Spot Trading'], ['cms-a3', 1600, 1190, 'Member List'], ['cms-a4', 1600, 1190, 'Member Details'], ['cms-a5', 1600, 1190, 'Transaction History'], ['cms-a6', 1600, 1190, 'Financial Reports']] }
        ] }
      ]
    },
    {
      key: 'vpay',
      name: 'VPay',
      title: 'VPay Remittance',
      accent: '#ff7a21',
      logo: ['vpay', 433, 192],
      intro: 'VPay App is a modern digital money transfer application that supports fast sending and receiving of funds, convenient payments, and easy transaction management on a secure platform. With a user-friendly interface and advanced technology, VPay delivers a smart, convenient, and flexible financial experience for modern digital life.',
      field: 'Remittance App',
      tabs: [
        { label: 'Mobile App', slug: 'mobile', subs: [
          { label: 'Send', sections: [{ base: 3144, switch: [
            { label: 'Send', steps: true, items: [['send-1', 750, 1624, 'Main page'], ['send-2', 750, 1624, 'Send Money'], ['send-3', 750, 1624, 'Select Recipient'], ['send-4', 750, 1624, 'Select Delivery Method'], ['send-5', 750, 1624, 'Select payment method'], ['send-6', 750, 1624, 'Confirm Info'], ['send-7', 750, 1624, 'Quick login'], ['send-8', 750, 1624, 'User Center - Add bank account']] },
            { label: 'Add Beneficiary Details & Transaction Details', steps: true, items: [['send-9', 750, 1624, 'Add Beneficiary Details'], ['send-10', 750, 1624, 'Beneficiary Details'], ['send-11', 750, 1624, 'Delete Beneficiary Popup']] }
          ] }] },
          { label: 'History', sections: [
            { title: 'Transaction History', base: 3144, steps: true, items: [['history-1', 750, 1624, 'No History Available'], ['history-2', 750, 1624, 'Transaction History'], ['history-3', 750, 1624, 'Transaction Details'], ['history-4', 750, 1624, 'Cancel Transaction Popup']] }
          ] },
          { label: 'Support', sections: [
            { title: 'Customer Center', base: 3144, items: [['support-1', 750, 1624, 'Customer Center'], ['support-2', 750, 1624, 'Customer Center Popup']] }
          ] },
          { label: 'Profile', sections: [{ base: 3144, switch: [
            { label: 'Profile', items: [['profile-a1-1', 750, 1624, 'Main Page'], ['profile-a1-2', 750, 1624, 'Popup Log Out']] },
            { label: 'User Rank', items: [['profile-a2-1', 750, 1624, 'User Rank - Gold'], ['profile-a2-2', 750, 1624, 'User Rank - My Level Gold']] },
            { label: 'Coupon', items: [['profile-a3-1', 750, 1624, 'Main Page'], ['profile-a3-2', 750, 1624, 'No Coupon Available']] },
            { label: 'Lucky Box', items: [['profile-a4-1', 750, 1624, 'Lucky Box'], ['profile-a4-2', 750, 1624, 'Open Lucky Box Popup']] },
            { label: 'Verification', steps: true, items: [['profile-a5-1', 750, 1624, '1. Manage My Info'], ['profile-a5-2', 750, 1624, '2. Choose Nationality'], ['profile-a5-3', 750, 1624, '3. Select Verification Method'], ['profile-a5-4', 750, 1624, '4. Enter Your Korean Registration Number'], ['profile-a5-5', 750, 1624, '5. Document Verification'], ['profile-a5-6', 750, 1624, '6. Scan ID'], ['profile-a5-7', 750, 1624, '7. Scan ID'], ['profile-a5-8', 750, 1624, '8. Confirm Information']] }
          ] }] }
        ] },
        { label: 'Design System', slug: 'design-system', sections: [
          { tabs: true, items: [['ds-1', 772, 1189, 'Typography'], ['ds-2', 772, 1189, 'Color Palette'], ['ds-3', 772, 1167, 'Iconography'], ['ds-4', 772, 1189, '3D Icon Graphics']] }
        ] },
        { label: 'CMS', slug: 'cms', sections: [
          { tabs: true, items: [['cms-a1', 1600, 1190, 'Dashboard'], ['cms-a2', 1600, 1190, 'KYC list'], ['cms-a3', 1600, 856, 'Transaction list'], ['cms-a4', 1600, 856, 'Refunding Management'], ['cms-a5', 1600, 1410, 'Transaction Detail'], ['cms-a6', 1600, 1410, 'Refunding Detail'], ['cms-a7', 1600, 856, 'FX Management'], ['cms-a8', 1600, 856, 'Limit Management']] }
        ] }
      ]
    },
    {
      key: 'antarctic',
      name: 'Antarctic',
      title: 'Antarctic Exchange (AX)',
      accent: '#6b7aff',
      logo: ['antarctic', 480, 81],
      intro: 'Antarctic (AX) is a perpetual futures exchange built for professional traders. Combining institutional-grade execution with on-chain settlement — designed around market integrity and trader-aligned incentives.',
      field: 'Trading Platform',
      tabs: [
        { label: 'Landing Page', slug: 'landing', sections: [
          { title: 'About Us', tall: true, items: [['landing', 2814, 11699]] }
        ] },
        { label: 'Liquidity Pool & Earn', slug: 'liquidity', img: 'liquidity', size: [3175, 3445] },
        { label: 'Asset & Order', slug: 'asset-order', sections: [
          { tabs: true, items: [['asset', 2880, 1622, 'Asset'], ['withdraw', 2880, 2250, 'Withdraw'], ['deposit', 2880, 2274, 'Deposit History']] }
        ] }
      ]
    },
    {
      key: 'lppm',
      name: 'LPPM Rental',
      title: 'LPPM Rental',
      accent: '#3444f7',
      logo: ['lppm', 608, 240],
      intro: 'LPPM Rental is the website of Liberty Place Property Management, a rental service for luxury New York City apartments with no broker fee. Renters can browse apartments and commercial spaces, view the gallery and apply online.',
      field: 'Real Estate Website',
      tabs: [
        { label: 'Landing Page', slug: 'landing', sections: [
          { title: 'Homepage', tall: true, items: [['home', 1440, 4326]] }
        ] },
        { label: 'Apartment Detail', slug: 'apartment-detail', sections: [
          { title: 'Apartment detail', tall: true, items: [['apt', 1440, 2631]] }
        ] },
        { label: 'Apply For Your New Apartment', slug: 'apply', sections: [
          { title: 'Apply for your new apartment', tall: true, items: [['apply', 1440, 1929]] }
        ] },
        { label: 'Commercial', slug: 'commercial', sections: [
          { title: 'Commercial', tall: true, items: [['commercial', 1440, 1908]] }
        ] },
        { label: 'Interested Page', slug: 'interested', sections: [
          { title: 'Interested page', tall: true, items: [['interested', 1440, 2208]] }
        ] },
        { label: 'Gallery', slug: 'gallery', sections: [
          { title: 'Gallery', tall: true, items: [['gallery', 1440, 1908]] }
        ] }
      ]
    }
  ];

  function slugify(s) {
    return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  var params = new URLSearchParams(location.search);
  var index = 0;
  PROJECTS.forEach(function (p, i) { if (p.key === params.get('p')) index = i; });
  var project = PROJECTS[index];
  var prev = PROJECTS[(index + PROJECTS.length - 1) % PROJECTS.length];
  var next = PROJECTS[(index + 1) % PROJECTS.length];

  /* ---------- header ---------- */
  document.title = project.title + " · Anh Anh's Portfolio";
  root.style.setProperty('--accent', project.accent);
  document.getElementById('crumb-name').textContent = project.name;
  var prevLink = document.getElementById('prev-project');
  var nextLink = document.getElementById('next-project');
  prevLink.href = 'project.html?p=' + prev.key;
  prevLink.setAttribute('aria-label', 'Previous project: ' + prev.title);
  prevLink.title = prev.title;
  nextLink.href = 'project.html?p=' + next.key;
  nextLink.setAttribute('aria-label', 'Next project: ' + next.title);
  nextLink.title = next.title;

  // Project switcher under the project name in the breadcrumb
  var crumbBtn = document.getElementById('crumb-toggle');
  var crumbMenu = document.getElementById('crumb-menu');
  PROJECTS.forEach(function (p) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = 'project.html?p=' + p.key;
    a.textContent = p.title;
    a.style.setProperty('--dot', p.accent);
    if (p === project) a.setAttribute('aria-current', 'page');
    li.appendChild(a);
    crumbMenu.appendChild(li);
  });
  function setCrumbMenu(open) {
    crumbMenu.hidden = !open;
    crumbBtn.setAttribute('aria-expanded', String(open));
  }
  crumbBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    setCrumbMenu(crumbMenu.hidden);
    if (!crumbMenu.hidden) crumbMenu.querySelector('a').focus();
  });
  document.addEventListener('click', function (e) {
    if (!crumbMenu.hidden && !crumbMenu.contains(e.target)) setCrumbMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !crumbMenu.hidden) { setCrumbMenu(false); crumbBtn.focus(); }
  });

  // Two exports of the logo: one per theme
  [['pj-logo', '-logo.png', project.title + ' logo'], ['pj-logo-light', '-logo-light.png', '']].forEach(function (v) {
    var el = document.getElementById(v[0]);
    el.src = DIR + project.logo[0] + v[1];
    el.width = project.logo[1] / 2;
    el.height = project.logo[2] / 2;
    el.alt = v[2];
  });
  document.getElementById('pj-title').textContent = project.title;
  document.getElementById('pj-desc').textContent = project.intro;
  document.getElementById('pj-field').textContent = project.field;

  /* ---------- tabs ---------- */
  var tabsEl = document.getElementById('pj-tabs');
  var subsEl = document.getElementById('pj-subtabs');
  var view = document.getElementById('pj-view');
  var state = { tab: 0, sub: 0 };

  // Deep link: #<tab>/<sub>, e.g. #web/spot
  (function readHash() {
    var parts = decodeURIComponent(location.hash.slice(1)).split('/');
    project.tabs.forEach(function (t, i) {
      if (t.slug === parts[0] && !t.soon) {
        state.tab = i;
        (t.subs || []).forEach(function (s, j) { if (slugify(s.label) === parts[1]) state.sub = j; });
      }
    });
  })();

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function tabButton(cls, label, selected, controls) {
    var b = el('button', cls, label);
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(selected));
    if (controls) b.setAttribute('aria-controls', controls);
    b.tabIndex = selected ? 0 : -1;
    return b;
  }

  function select(list, i) {
    Array.prototype.forEach.call(list.children, function (b, j) {
      b.setAttribute('aria-selected', String(j === i));
      b.tabIndex = j === i ? 0 : -1;
    });
  }

  // Left / right arrows move between tabs in a tab list
  function arrowKeys(list) {
    list.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var items = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]:not([aria-disabled="true"])'));
      var i = items.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var to = items[(i + (e.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length];
      to.focus();
      to.click();
    });
  }
  arrowKeys(tabsEl);
  arrowKeys(subsEl);

  // One screenshot, linked to the full-size file
  function shot(file, w, h, label) {
    var src = DIR + project.key + '/' + file + '.webp';
    var a = el('a', 'pj-shot');
    a.href = src;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', label + ' (open full size)');
    var im = el('img');
    im.src = src;
    im.alt = label;
    im.width = w;
    im.height = h;
    im.loading = 'lazy';
    im.decoding = 'async';
    a.appendChild(im);
    return a;
  }

  var CHEVRON = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="m12.5 4-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function arrowButton(next) {
    var b = el('button', 'pj-arrow' + (next ? ' pj-arrow--next' : ''));
    b.type = 'button';
    b.innerHTML = CHEVRON;
    b.setAttribute('aria-label', next ? 'Next screen' : 'Previous screen');
    return b;
  }

  // Screens side by side, 16px apart. items: [file, w, h, caption]; clusters
  // put a labelled group of screens next to another in the same strip.
  function buildStrip(opts, title) {
    var strip = el('div', 'pj-strip');
    strip.tabIndex = 0;
    strip.setAttribute('aria-label', title + ', scroll sideways');
    var figs = [];
    function addFigs(parent, items, steps) {
      items.forEach(function (it, i) {
        var fig = el('figure', 'pj-item');
        fig.style.setProperty('--w', it[1] / 2 + 'px');
        // base: share one scale with the mobile cards (the widest export fills the card)
        if (opts.base) fig.style.width = it[1] / opts.base * 100 + '%';
        if (steps) {
          var step = el('span', 'pj-step');
          if (i === items.length - 1) step.appendChild(el('span', 'pj-step__end'));
          fig.appendChild(step);
        }
        if (it[3] && opts.captions !== false) fig.appendChild(el('figcaption', '', it[3]));
        fig.appendChild(shot(it[0], it[1], it[2], project.title + ' — ' + (it[3] || title)));
        parent.appendChild(fig);
        figs.push(fig);
      });
    }
    if (opts.clusters) {
      strip.classList.add('pj-strip--clusters');
      opts.clusters.forEach(function (c) {
        var box = el('div', 'pj-cluster');
        box.appendChild(el('span', 'pj-pill pj-pill--static', c.title));
        var row = el('div', 'pj-cluster__row');
        addFigs(row, c.items, opts.steps);
        box.appendChild(row);
        strip.appendChild(box);
      });
    } else {
      addFigs(strip, opts.items, opts.steps);
    }
    return { strip: strip, figs: figs };
  }

  // Arrows (and pills, when given) move along a strip; scrolling keeps them in sync
  function wireStrip(strip, figs, nav, pills) {
    function left(f) { return f.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft; }
    function goTo(i) {
      var f = figs[Math.max(0, Math.min(figs.length - 1, i))];
      strip.scrollTo({ left: left(f), behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
    function current() {
      var x = strip.scrollLeft, best = 0;
      figs.forEach(function (f, i) { if (Math.abs(left(f) - x) < Math.abs(left(figs[best]) - x)) best = i; });
      // At the far end the last screens cannot reach the left edge
      if (x + strip.clientWidth >= strip.scrollWidth - 2) best = figs.length - 1;
      return best;
    }
    nav.replaceChildren();
    if (figs.length < 2) return goTo;
    var back = arrowButton(false), fwd = arrowButton(true);
    back.addEventListener('click', function () { goTo(current() - 1); });
    fwd.addEventListener('click', function () { goTo(current() + 1); });
    nav.appendChild(back);
    nav.appendChild(fwd);
    var ticking = false;
    function sync() {
      ticking = false;
      if (!strip.isConnected) return;
      var x = strip.scrollLeft;
      back.disabled = x <= 2;
      fwd.disabled = x + strip.clientWidth >= strip.scrollWidth - 2;
      if (pills) select(pills, current());
    }
    strip.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(sync); }
    }, { passive: true });
    requestAnimationFrame(sync);
    window.addEventListener('resize', sync);
    return goTo;
  }

  // One card. Kinds, by data:
  //   tall / fit   one image (tall scrolls inside a frame)
  //   switch       pills swap the card's content: a strip (items) or images (imgs)
  //   tabs         one strip; each caption becomes a pill that jumps to its screen
  //   clusters     one strip of labelled groups (e.g. Deposit and Withdraw responsive)
  //   otherwise    one strip under a static title pill
  function sectionCard(sec, label) {
    var card = el('section', 'pj-sec' + (sec.half ? ' pj-sec--half' : ''));
    var title = sec.title || sec.label || label;
    card.setAttribute('aria-label', title);
    if (sec.label) card.appendChild(el('p', 'pj-sec__label', sec.label));
    var head = el('div', 'pj-sec__head');
    var nav = el('div', 'pj-sec__nav');
    card.appendChild(head);

    if (sec.tall || sec.fit) {
      head.appendChild(el('span', 'pj-pill pj-pill--static', title));
      var frame = el('div', sec.tall ? 'pj-tall' : 'pj-fit');
      if (sec.tall) { frame.tabIndex = 0; frame.setAttribute('aria-label', title + ', scroll to see the whole page'); }
      var it = sec.items[0];
      frame.appendChild(shot(it[0], it[1], it[2], project.title + ' — ' + title));
      card.appendChild(frame);
      return card;
    }

    var pills = null;
    if (sec.switch || sec.tabs) {
      pills = el('div', 'pj-pills');
      pills.setAttribute('role', 'tablist');
      pills.setAttribute('aria-label', title + ' screens');
      head.appendChild(pills);
      arrowKeys(pills);
    } else if (!sec.clusters && !sec.bare) {
      head.appendChild(el('span', 'pj-pill pj-pill--static', title));
    }
    head.appendChild(nav);

    if (sec.switch) {
      card.classList.add('pj-sec--switch');
      var body = el('div', 'pj-sec__body');
      body.setAttribute('role', 'tabpanel');
      card.appendChild(body);
      var show = function (i) {
        var g = sec.switch[i];
        select(pills, i);
        body.replaceChildren();
        body.setAttribute('aria-label', g.label);
        if (g.items) {
          var s = buildStrip({ items: g.items, steps: g.steps, base: sec.base }, g.label);
          body.appendChild(s.strip);
          wireStrip(s.strip, s.figs, nav, null);
        } else {
          nav.replaceChildren();
          g.imgs.forEach(function (im) {
            var a = shot(im[0], im[1], im[2], project.title + ' — ' + g.label);
            // one scale for every screen in the card: the widest export (User Center) fills it
            a.style.width = sec.base ? Math.min(100, im[1] / sec.base * 100) + '%' : '';
            a.style.maxWidth = sec.base ? '' : im[1] / 2 + 'px';
            body.appendChild(a);
          });
        }
      };
      sec.switch.forEach(function (g, i) {
        var b = tabButton('pj-pill', g.label, i === 0);
        b.addEventListener('click', function () { show(i); });
        pills.appendChild(b);
      });
      show(0);
      return card;
    }

    var built = buildStrip({ items: sec.items, clusters: sec.clusters, steps: sec.steps, captions: !sec.tabs, base: sec.base }, title);
    card.appendChild(built.strip);
    var goTo = wireStrip(built.strip, built.figs, nav, pills);
    if (sec.tabs) {
      sec.items.forEach(function (it, i) {
        var b = tabButton('pj-pill', it[3], i === 0);
        b.addEventListener('click', function () { select(pills, i); goTo(i); });
        pills.appendChild(b);
      });
    }
    return card;
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function render(focusSub) {
    var tab = project.tabs[state.tab];

    tabsEl.replaceChildren();
    project.tabs.forEach(function (t, i) {
      var b = tabButton('pj-tab', t.label, i === state.tab, 'pj-view');
      if (t.soon) {
        b.setAttribute('aria-disabled', 'true');
        b.appendChild(el('span', 'pj-tab__soon', 'Soon'));
      }
      b.addEventListener('click', function () {
        if (t.soon || i === state.tab) return;
        state.tab = i;
        state.sub = 0;
        render();
      });
      tabsEl.appendChild(b);
    });

    subsEl.replaceChildren();
    (tab.subs || []).forEach(function (s, j) {
      var b = tabButton('pj-subtab', s.label, j === state.sub, 'pj-view');
      b.addEventListener('click', function () {
        if (j === state.sub) return;
        state.sub = j;
        render(true);
      });
      subsEl.appendChild(b);
    });
    if (focusSub) {
      var active = subsEl.querySelector('[aria-selected="true"]');
      if (active) active.focus({ preventScroll: true });
    }

    var screen = tab.subs ? tab.subs[state.sub] : tab;
    var label = tab.subs ? screen.label : tab.label;
    view.setAttribute('aria-label', project.title + ' — ' + tab.label + (tab.subs ? ', ' + screen.label : ''));
    view.replaceChildren();

    if (screen.sections) {
      var pair = null;
      screen.sections.forEach(function (sec) {
        var card = sectionCard(sec, label);
        // Two "half" cards share one row
        if (sec.half) {
          if (!pair) { pair = el('div', 'pj-pair'); view.appendChild(pair); }
          pair.appendChild(card);
          if (pair.children.length === 2) pair = null;
        } else {
          pair = null;
          view.appendChild(card);
        }
      });
      view.appendChild(el('p', 'pj-hint', 'Pick a tab, scroll sideways or use the arrows to move between screens. Click a screen to open it at full size.'));
    } else if (screen.img) {
      var box = el('section', 'pj-sec pj-sec--img');
      box.setAttribute('aria-label', label);
      if (screen.pill) {
        var head = el('div', 'pj-sec__head');
        head.appendChild(el('span', 'pj-pill pj-pill--static', screen.pill));
        box.appendChild(head);
      }
      var a = shot(screen.img, screen.size[0], screen.size[1], project.title + ' — ' + label + ' screens');
      if (screen.base) a.style.width = Math.min(100, screen.size[0] / screen.base * 100) + '%';
      box.appendChild(a);
      view.appendChild(box);
      view.appendChild(el('p', 'pj-hint', 'Click the image to open it at full size.'));
    } else {
      var empty = el('div', 'pj-empty');
      empty.innerHTML = '<strong>Coming soon</strong><span>These screens are still being prepared.</span>';
      view.appendChild(empty);
    }

    var hash = '#' + tab.slug + (tab.subs ? '/' + slugify(screen.label) : '');
    if (location.hash !== hash) history.replaceState(null, '', hash);
  }
  render();

  /* ---------- theme ---------- */
  var toggle = document.getElementById('theme-toggle');
  function applyTheme(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function flipTheme() {
    var nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    store('theme', nextTheme);
  }
  applyTheme(root.dataset.theme || 'dark');
  toggle.addEventListener('click', flipTheme);

  /* ---------- mobile / tablet menu ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu-panel');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(menu.hidden);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="theme"]')) flipTheme();
    setMenu(false);
  });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target)) setMenu(false);
  });

  /* ---------- resume popup ---------- */
  var cv = document.getElementById('cv');
  var cvBody = cv.querySelector('.cv__body');
  var lastFocus = null;
  document.querySelectorAll('[data-open-cv]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(false);
      lastFocus = document.activeElement;
      cvBody.scrollTop = 0;
      if (typeof cv.showModal === 'function') cv.showModal();
      else cv.setAttribute('open', '');
    });
  });
  cv.querySelector('.cv__close').addEventListener('click', function () { cv.close(); });
  // "View my portfolio" goes back to the home page
  cv.querySelector('.cv__portfolio').addEventListener('click', function () {
    location.href = 'index.html#home';
  });
  cv.addEventListener('click', function (e) { if (e.target === cv) cv.close(); });
  cv.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });
  cvBody.addEventListener('scroll', function () {
    cv.classList.toggle('is-scrolled', cvBody.scrollTop > 4);
  }, { passive: true });
})();
