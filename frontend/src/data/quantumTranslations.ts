export type SupportedLanguage = 'en' | 'hi' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' }
];

export interface BasicsSectionTranslation {
  title: string;
  tagline: string;
  paragraphs: string[];
  keyTakeaways: string[];
}

export interface TopicTranslation {
  topic_name: string;
  short_definition: string;
  beginner_explanation?: string;
  keywords: string[];
}

export const BASICS_TRANSLATIONS: Record<SupportedLanguage, Record<string, BasicsSectionTranslation>> = {
  en: {
    'classical-vs-qubits': {
      title: 'Classical Bits vs Qubits',
      tagline: 'Definite States vs Quantum Probability Amplitudes',
      paragraphs: [
        'In classical computing, information is processed using classical bits. These bits are like simple physical switches: they are definitively either in a state of 0 or a state of 1. There is no ambiguity.',
        'Quantum bits, or qubits, are fundamentally different. A qubit is described by a quantum state |ψ⟩, which consists of complex probability amplitudes α and β. Unlike a classical bit, a qubit doesn\'t simply hold a classical value of 0 or 1.',
        'Instead, a qubit\'s state determines the probabilities of measurement outcomes. When measured, it collapses to 0 or 1, but the likelihood of each outcome is governed by the state\'s amplitudes prior to measurement (|α|² and |β|²).'
      ],
      keyTakeaways: [
        'Classical bits are binary switches (strictly 0 or 1).',
        'Qubits exist in a state vector |ψ⟩ = α|0⟩ + β|1⟩.',
        'Scientific truth: A qubit is NOT \'both 0 and 1 simultaneously\'; it is in a single definite quantum state that determines measurement probabilities.'
      ]
    },
    'what-is-qubit': {
      title: 'What is a Qubit?',
      tagline: 'The Fundamental Unit of Quantum Information',
      paragraphs: [
        'A qubit (quantum bit) is the fundamental unit of quantum information, analogous to the bit in classical computing. However, qubits obey the laws of quantum mechanics rather than classical electrodynamics.',
        'Physical qubits are realized using isolated quantum systems: electron spin (spin-up |0⟩ and spin-down |1⟩), photon polarization (horizontal |H⟩ and vertical |V⟩), or superconducting Josephson junction circuits (transmon qubits).',
        'Mathematically, a qubit is represented as a unit vector in a 2-dimensional complex Hilbert space ℂ², written using Dirac bra-ket notation as |ψ⟩.'
      ],
      keyTakeaways: [
        'Qubits are physical quantum systems with 2 isolated computational states.',
        'Common physical types: superconducting transmon qubits, trapped ions, neutral atoms, and photonic circuits.',
        'Described mathematically by Dirac ket vectors |ψ⟩ in complex 2D Hilbert space.'
      ]
    },
    'qubit-states': {
      title: 'Qubit States |0⟩ and |1⟩',
      tagline: 'The Computational Basis Vectors',
      paragraphs: [
        'Every single-qubit state can be represented with reference to two orthonormal basis vectors: |0⟩ (ground state) and |1⟩ (excited state). These are the computational basis states.',
        'In linear algebra column vector notation, |0⟩ = [1, 0]ᵀ and |1⟩ = [0, 1]ᵀ. Because they are orthonormal, their inner product satisfies ⟨0|1⟩ = 0 and ⟨0|0⟩ = ⟨1|1⟩ = 1.',
        'When a qubit prepared in |0⟩ is measured in the computational basis, it yields 0 with 100% certainty. Likewise, |1⟩ yields 1 with 100% certainty.'
      ],
      keyTakeaways: [
        'Computational basis states: |0⟩ = [1, 0]ᵀ and |1⟩ = [0, 1]ᵀ.',
        'They form an orthonormal basis spanning all single-qubit quantum states.',
        'Measuring basis state |0⟩ yields classical bit 0; measuring |1⟩ yields bit 1.'
      ]
    },
    'superposition': {
      title: 'Superposition',
      tagline: 'Linear Combinations of Basis States',
      paragraphs: [
        'A qubit can exist in a linear combination of basis states: |ψ⟩ = α|0⟩ + β|1⟩, where α, β ∈ ℂ are probability amplitudes.',
        'Superposition is a consequence of the linearity of quantum state space. Applying a Hadamard gate H to |0⟩ creates the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2.',
        'Crucial distinction: Superposition does NOT mean the qubit is secretly 0 and 1 at the same time. The qubit is in one unique quantum state that exhibits wave-like constructive and destructive interference.'
      ],
      keyTakeaways: [
        'State equation: |ψ⟩ = α|0⟩ + β|1⟩ with normalization |α|² + |β|² = 1.',
        'Equal superposition |+⟩ = H|0⟩ yields 50% probability for 0 and 50% for 1.',
        'Enables quantum parallelism and interference across computational pathways.'
      ]
    },
    'probability-amplitudes': {
      title: 'Probability Amplitudes',
      tagline: 'Born\'s Rule and the Geometry of Chance',
      paragraphs: [
        'The coefficients α and β in |ψ⟩ = α|0⟩ + β|1⟩ are called probability amplitudes. Amplitudes are complex numbers having both magnitude and phase: α = r_0 e^(iφ_0) and β = r_1 e^(iφ_1).',
        'According to Born\'s Rule, the probability of measuring outcome 0 is P(0) = |α|², and outcome 1 is P(1) = |β|². The total probability must always equal 1: |α|² + |β|² = 1.',
        'While measurement probabilities depend only on magnitudes |α| and |β|, relative phase Δφ = φ_1 - φ_0 determines whether quantum waves add constructively or destructively during quantum interference.'
      ],
      keyTakeaways: [
        'Born\'s Rule: P(0) = |α|² and P(1) = |β|².',
        'Total probability conservation: |α|² + |β|² = 1.',
        'Relative phase φ governs interference without altering individual state probabilities.'
      ]
    },
    'measurement': {
      title: 'Measurement',
      tagline: 'Wavefunction Collapse and Classical Extraction',
      paragraphs: [
        'Measurement is the physical act of extracting classical information from a quantum system. Prior to measurement, the qubit evolves deterministically and reversibly via unitary operators.',
        'Upon measurement in the computational basis, the superposition instantly collapses to either |0⟩ (with probability |α|²) or |1⟩ (with probability |β|²).',
        'Measurement collapse is irreversible: once measured, the relative phase and original superposition are permanently destroyed, and subsequent measurements yield the same outcome.'
      ],
      keyTakeaways: [
        'Extracts classical bits (0 or 1) from quantum probability amplitudes.',
        'Causes irreversible state collapse according to Born\'s Rule.',
        'Subsequent repeated measurements of the collapsed state yield identical results.'
      ]
    },
    'bloch-sphere': {
      title: 'The Bloch Sphere',
      tagline: 'Geometric Visualization of a Single Qubit',
      paragraphs: [
        'The Bloch sphere is a unit sphere that provides a complete geometric representation for pure states of a two-level quantum system (single qubit).',
        'Any single-qubit pure state can be written as |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, where θ ∈ [0, π] represents the polar angle and φ ∈ [0, 2π) represents the azimuthal phase angle.',
        'The north pole represents |0⟩, the south pole represents |1⟩, and the equator represents equal superpositions with differing relative phases (|+⟩, |−⟩, |i⟩, |−i⟩). Single-qubit quantum gates correspond to rotations of this sphere.'
      ],
      keyTakeaways: [
        'North Pole = |0⟩, South Pole = |1⟩, Equator = Equal Superpositions.',
        'Polar angle θ controls outcome probabilities; Azimuthal angle φ controls phase.',
        'Single-qubit quantum gates (X, Y, Z, H, S, T) are geometric rotations on the Bloch sphere.'
      ]
    }
  },
  hi: {
    'classical-vs-qubits': {
      title: 'क्लासिकल बिट्स बनाम क्युबिट्स',
      tagline: 'निश्चित अवस्थाएँ बनाम क्वांटम प्रायिकता आयाम',
      paragraphs: [
        'क्लासिकल कंप्यूटिंग में, सूचना को क्लासिकल बिट्स (bits) के माध्यम से संसाधित किया जाता है। ये बिट्स एक साधारण स्विच की तरह होते हैं: वे निश्चित रूप से या तो 0 या 1 की अवस्था में होते हैं। यहाँ कोई अनिश्चितता नहीं होती।',
        'क्वांटम बिट्स, या क्युबिट्स (qubits), मौलिक रूप से भिन्न होते हैं। एक क्युबिट को क्वांटम अवस्था |ψ⟩ द्वारा वर्णित किया जाता है, जिसमें सम्मिश्र प्रायिकता आयाम α और β होते हैं। क्लासिकल बिट के विपरीत, क्युबिट केवल 0 या 1 का साधारण मान नहीं रखता।',
        'इसके बजाय, क्युबिट की अवस्था मापन परिणामों की प्रायिकताओं (probabilities) को निर्धारित करती है। मापे जाने पर, यह 0 या 1 पर संकुचित (collapse) होता है, लेकिन प्रत्येक परिणाम की संभावना मापन से पहले के आयामों (|α|² और |β|²) द्वारा नियंत्रित होती है।'
      ],
      keyTakeaways: [
        'क्लासिकल बिट्स बाइनरी स्विच हैं (सख्त रूप से 0 या 1)।',
        'क्युबिट्स अवस्था सदिश |ψ⟩ = α|0⟩ + β|1⟩ में विद्यमान होते हैं।',
        'वैज्ञानिक तथ्य: क्युबिट एक साथ \'0 और 1 दोनों\' नहीं होता; यह एक निश्चित क्वांटम अवस्था में होता है जो मापन प्रायिकताओं को तय करती है।'
      ]
    },
    'what-is-qubit': {
      title: 'क्युबिट क्या है?',
      tagline: 'क्वांटम सूचना की मौलिक इकाई',
      paragraphs: [
        'क्युबिट (क्वांटम बिट) क्वांटम सूचना की मौलिक इकाई है, जो क्लासिकल कंप्यूटिंग में बिट के समतुल्य है। हालाँकि, क्युबिट्स क्लासिकल इलेक्ट्रोडायनामिक्स के बजाय क्वांटम यांत्रिकी (quantum mechanics) के नियमों का पालन करते हैं।',
        'भौतिक क्युबिट्स को पृथक क्वांटम प्रणालियों का उपयोग करके तैयार किया जाता है: इलेक्ट्रॉन स्पिन (स्पिन-अप |0⟩ और स्पिन-डाउन |1⟩), फोटॉन ध्रुवीकरण (horizontal |H⟩ और vertical |V⟩), या सुपरकंडक्टिंग जोसेफसन जंक्शन परिपथ (transmon qubits)।',
        'गणितीय रूप से, एक क्युबिट को 2-आयामी सम्मिश्र हिल्बर्ट स्पेस ℂ² में एक इकाई सदिश के रूप में दर्शाया जाता है, जिसे डिराक ब्रा-केट संकेतन में |ψ⟩ लिखा जाता है।'
      ],
      keyTakeaways: [
        'क्युबिट्स 2 पृथक कम्प्यूटेशनल अवस्थाओं वाली भौतिक क्वांटम प्रणालियाँ हैं।',
        'प्रमुख भौतिक प्रकार: सुपरकंडक्टिंग ट्रांसमॉन क्युबिट्स, ट्रैप्ड आयन, और फोटोनिक परिपथ।',
        'सम्मिश्र 2D हिल्बर्ट स्पेस में डिराक केट सदिश |ψ⟩ द्वारा गणितीय रूप से वर्णित।'
      ]
    },
    'qubit-states': {
      title: 'क्युबिट अवस्थाएँ |0⟩ और |1⟩',
      tagline: 'कम्प्यूटेशनल आधार सदिश (Basis Vectors)',
      paragraphs: [
        'प्रत्येक सिंगल-क्युबिट अवस्था को दो ऑर्थोनॉर्मल आधार सदिशों के संदर्भ में दर्शाया जा सकता है: |0⟩ (मूल अवस्था - ground state) और |1⟩ (उत्तेजित अवस्था - excited state)। इन्हें कम्प्यूटेशनल आधार अवस्थाएँ कहा जाता है।',
        'रैखिक बीजगणित के कॉलम वेक्टर संकेतन में, |0⟩ = [1, 0]ᵀ और |1⟩ = [0, 1]ᵀ। क्योंकि वे ऑर्थोनॉर्मल हैं, उनका आंतरिक गुणनफल ⟨0|1⟩ = 0 और ⟨0|0⟩ = ⟨1|1⟩ = 1 होता है।',
        'जब |0⟩ में तैयार क्युबिट को कम्प्यूटेशनल आधार में मापा जाता है, तो यह 100% निश्चितता के साथ 0 देता है। इसी प्रकार, |1⟩ 100% निश्चितता के साथ 1 देता है।'
      ],
      keyTakeaways: [
        'कम्प्यूटेशनल आधार अवस्थाएँ: |0⟩ = [1, 0]ᵀ और |1⟩ = [0, 1]ᵀ।',
        'वे सभी सिंगल-क्युबिट क्वांटम अवस्थाओं को समाहित करने वाला ऑर्थोनॉर्मल आधार बनाती हैं।',
        'आधार अवस्था |0⟩ को मापने पर बिट 0 मिलता है; |1⟩ को मापने पर बिट 1 मिलता है।'
      ]
    },
    'superposition': {
      title: 'सुपरपोजिशन (Superposition)',
      tagline: 'आधार अवस्थाओं का रैखिक संयोजन',
      paragraphs: [
        'एक क्युबिट आधार अवस्थाओं के रैखिक संयोजन (linear combination) में रह सकता है: |ψ⟩ = α|0⟩ + β|1⟩, जहाँ α, β ∈ ℂ प्रायिकता आयाम हैं।',
        'सुपरपोजिशन क्वांटम अवस्था स्थान की रैखिकता का प्रत्यक्ष परिणाम है। |0⟩ पर हैडामार्ड गेट H लागू करने से समान सुपरपोजिशन अवस्था |+⟩ = (|0⟩ + |1⟩)/√2 बनती है।',
        'महत्वपूर्ण भेद: सुपरपोजिशन का अर्थ यह नहीं है कि क्युबिट एक ही समय में गुप्त रूप से 0 और 1 है। क्युबिट एक अनूठी क्वांटम अवस्था में होता है जो तरंग जैसी रचनात्मक और विनाशी हस्तक्षेप (interference) प्रदर्शित करती है।'
      ],
      keyTakeaways: [
        'अवस्था समीकरण: |ψ⟩ = α|0⟩ + β|1⟩, जहाँ सामान्यीकरण |α|² + |β|² = 1 होता है।',
        'समान सुपरपोजिशन |+⟩ = H|0⟩ से 0 के लिए 50% और 1 के लिए 50% संभावना मिलती है।',
        'यह कम्प्यूटेशनल मार्गों पर क्वांटम समानांतरता और हस्तक्षेप को सक्षम बनाता है।'
      ]
    },
    'probability-amplitudes': {
      title: 'प्रायिकता आयाम (Probability Amplitudes)',
      tagline: 'बॉर्न का नियम और क्वांटम संभावना की ज्यामिति',
      paragraphs: [
        'समीकरण |ψ⟩ = α|0⟩ + β|1⟩ में गुणांक α और β को प्रायिकता आयाम कहा जाता है। आयाम सम्मिश्र संख्याएँ होते हैं जिनमें परिमाण और कला (phase) दोनों होते हैं: α = r_0 e^(iφ_0) और β = r_1 e^(iφ_1)।',
        'बॉर्न के नियम (Born\'s Rule) के अनुसार, परिणाम 0 को मापने की प्रायिकता P(0) = |α|² है, और परिणाम 1 की P(1) = |β|² है। कुल प्रायिकता हमेशा 1 होनी चाहिए: |α|² + |β|² = 1।',
        'जबकि मापन प्रायिकताएँ केवल परिमाण |α| और |β| पर निर्भर करती हैं, सापेक्ष कला Δφ = φ_1 - φ_0 यह निर्धारित करती है कि क्वांटम हस्तक्षेप के दौरान तरंगें रचनात्मक रूप से जुड़ेंगी या विनाशी रूप से।'
      ],
      keyTakeaways: [
        'बॉर्न का नियम: P(0) = |α|² और P(1) = |β|²।',
        'कुल प्रायिकता संरक्षण: |α|² + |β|² = 1।',
        'सापेक्ष कला φ अलग-अलग अवस्था प्रायिकताओं को बदले बिना क्वांटम हस्तक्षेप को नियंत्रित करती है।'
      ]
    },
    'measurement': {
      title: 'मापन (Measurement)',
      tagline: 'तरंगफलन संकुचन (Collapse) और क्लासिकल निष्कर्षण',
      paragraphs: [
        'मापन किसी क्वांटम प्रणाली से क्लासिकल जानकारी निकालने की भौतिक प्रक्रिया है। मापन से पहले, क्युबिट एकात्मक ऑपरेटरों (unitary operators) के माध्यम से प्रतिवर्ती रूप से विकसित होता है।',
        'कम्प्यूटेशनल आधार में मापन करने पर, सुपरपोजिशन तुरंत या तो |0⟩ (प्रायिकता |α|² के साथ) या |1⟩ (प्रायिकता |β|² के साथ) पर संकुचित (collapse) हो जाता है।',
        'मापन संकुचन अपरिवर्तनीय है: एक बार मापे जाने के बाद, सापेक्ष कला और मूल सुपरपोजिशन स्थायी रूप से नष्ट हो जाते हैं, और बाद के मापन वही परिणाम देते हैं।'
      ],
      keyTakeaways: [
        'क्वांटम प्रायिकता आयामों से क्लासिकल बिट्स (0 या 1) निकालता है।',
        'बॉर्न के नियम के अनुसार अपरिवर्तनीय अवस्था संकुचन का कारण बनता है।',
        'संकुचित अवस्था के बाद के बार-बार किए गए मापन समान परिणाम देते हैं।'
      ]
    },
    'bloch-sphere': {
      title: 'द ब्लोच गोला (Bloch Sphere)',
      tagline: 'सिंगल क्युबिट का ज्यामितीय दृश्य',
      paragraphs: [
        'ब्लोच गोला एक इकाई गोला है जो दो-स्तरीय क्वांटम प्रणाली (सिंगल क्युबिट) की शुद्ध अवस्थाओं के लिए एक पूर्ण ज्यामितीय प्रतिनिधित्व प्रदान करता है।',
        'किसी भी सिंगल-क्युबिट शुद्ध अवस्था को |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ के रूप में लिखा जा सकता है, जहाँ θ ∈ [0, π] ध्रुवीय कोण (polar angle) और φ ∈ [0, 2π) दिगंशीय कला कोण (azimuthal phase angle) है।',
        'उत्तरी ध्रुव |0⟩ का प्रतिनिधित्व करता है, दक्षिणी ध्रुव |1⟩ का, और भूमध्य रेखा विभिन्न सापेक्ष कलाओं वाली समान सुपरपोजिशन अवस्थाओं (|+⟩, |−⟩, |i⟩, |−i⟩) का प्रतिनिधित्व करती है। सिंगल-क्युबिट गेट्स इस गोले के घूर्णन (rotations) के अनुरूप हैं।'
      ],
      keyTakeaways: [
        'उत्तरी ध्रुव = |0⟩, दक्षिणी ध्रुव = |1⟩, भूमध्य रेखा = समान सुपरपोजिशन।',
        'ध्रुवीय कोण θ परिणाम प्रायिकताओं को नियंत्रित करता है; कला कोण φ कला को नियंत्रित करता है।',
        'सिंगल-क्युबिट क्वांटम गेट्स (X, Y, Z, H, S, T) ब्लोच गोले पर ज्यामितीय घूर्णन हैं।'
      ]
    }
  },
  ta: {
    'classical-vs-qubits': {
      title: 'கிளாசிக்கல் பிட்கள் vs க்யூபிட்கள்',
      tagline: 'திட்டவட்டமான நிலைகள் vs குவாண்டம் நிகழ்தகவு வீச்சுகள்',
      paragraphs: [
        'கிளாசிக்கல் கம்ப்யூட்டிங்கில், தகவல்கள் கிளாசிக்கல் பிட்களைப் (bits) பயன்படுத்தி செயலாக்கப்படுகின்றன. இவை எளிய மின்சார சுவிட்சுகள் போன்றவை: அவை உறுதியாக 0 அல்லது 1 என்ற நிலையில் மட்டுமே இருக்கும். இதில் எந்த குழப்பமும் இல்லை.',
        'குவாண்டம் பிட்கள், அல்லது க்யூபிட்கள் (qubits), முற்றிலும் வேறுபட்டவை. ஒரு க்யூபிட் குவாண்டம் நிலை |ψ⟩ மூலம் விவரிக்கப்படுகிறது, இதில் சிக்கலான நிகழ்தகவு வீச்சுகளான α மற்றும் β உள்ளன. கிளாசிக்கல் பிட்டைப் போல, க்யூபிட் வெறும் 0 அல்லது 1 என்ற மதிப்பை மட்டும் கொண்டிருக்காது.',
        'மாறாக, க்யூபிட்டின் நிலை அளவீட்டு முடிவுகளின் நிகழ்தகவுகளைத் (probabilities) தீர்மானிக்கிறது. அளவிடப்படும் போது, அது 0 அல்லது 1 நிலைக்குச் சுருங்குகிறது (collapse), ஆனால் ஒவ்வொரு முடிவின் சாத்தியமும் அளவீட்டிற்கு முந்தைய வீச்சுகளால் (|α|² மற்றும் |β|²) நிர்வகிக்கப்படுகிறது.'
      ],
      keyTakeaways: [
        'கிளாசிக்கல் பிட்கள் இரும சுவிட்சுகள் (கண்டிப்பாக 0 அல்லது 1).',
        'க்யூபிட்கள் நிலை வெக்டரில் |ψ⟩ = α|0⟩ + β|1⟩ நிலவுகின்றன.',
        'அறிவியல் உண்மை: க்யூபிட் ஒரே நேரத்தில் \'0 மற்றும் 1 ஆகிய இரண்டிலும்\' இருப்பதில்லை; அது அளவீட்டு நிகழ்தகவுகளைத் தீர்மானிக்கும் ஒரு தனித்துவமான குவாண்டம் நிலையில் உள்ளது.'
      ]
    },
    'what-is-qubit': {
      title: 'க்யூபிட் என்றால் என்ன?',
      tagline: 'குவாண்டம் தகவலின் அடிப்படை அலகு',
      paragraphs: [
        'க்யூபிட் (குவாண்டம் பிட்) என்பது குவாண்டம் தகவலின் அடிப்படை அலகாகும், இது கிளாசிக்கல் கம்ப்யூட்டிங்கில் உள்ள பிட்டுக்கு ஒப்பானது. இருப்பினும், க்யூபிட்கள் கிளாசிக்கல் மின்காந்தவியலுக்குப் பதிலாக குவாண்டம் இயக்கவியல் (quantum mechanics) விதிகளுக்கு உட்பட்டவை.',
        'இயற்பியல் க்யூபிட்கள் தனிமைப்படுத்தப்பட்ட குவாண்டம் அமைப்புகளைப் பயன்படுத்தி உருவாக்கப்படுகின்றன: எலக்ட்ரான் சுழற்சி (spin-up |0⟩ மற்றும் spin-down |1⟩), ஃபோட்டான் துருவமுனைப்பு (horizontal |H⟩ மற்றும் vertical |V⟩), அல்லது சூப்பர்கண்டக்டிங் ஜோசப்சன் சந்திப்பு சுற்றுகள் (transmon qubits).',
        'கணித ரீதியாக, ஒரு க்யூபிட் 2-பரிமாண சிக்கலான ஹில்பர்ட் வெளியில் ℂ² ஒரு அலகு வெக்டராகக் குறிப்பிடப்படுகிறது, இது டிராக் பிரா-கெட் குறியீட்டில் |ψ⟩ என எழுதப்படுகிறது.'
      ],
      keyTakeaways: [
        'க்யூபிட்கள் 2 தனிமைப்படுத்தப்பட்ட கணக்கீட்டு நிலைகளைக் கொண்ட இயற்பியல் குவாண்டம் அமைப்புகளாகும்.',
        'முக்கிய வகைகள்: சூப்பர்கண்டக்டிங் டிரான்ஸ்மான் க்யூபிட்கள், சிக்கிய அயனிகள் மற்றும் ஃபோட்டானிக் சுற்றுகள்.',
        'சிக்கலான 2D ஹில்பர்ட் வெளியில் டிராக் கெட் வெக்டர்கள் |ψ⟩ மூலம் விவரிக்கப்படுகிறது.'
      ]
    },
    'qubit-states': {
      title: 'க்யூபிட் நிலைகள் |0⟩ மற்றும் |1⟩',
      tagline: 'கணக்கீட்டு அடிப்படை வெக்டர்கள் (Basis Vectors)',
      paragraphs: [
        'ஒவ்வொரு சிங்கிள்-க்யூபிட் நிலையையும் இரண்டு செங்குத்து அடிப்படை வெக்டர்களின் அடிப்படையில் குறிப்பிடலாம்: |0⟩ (அடிப்படை நிலை - ground state) மற்றும் |1⟩ (கிளர்வுற்ற நிலை - excited state). இவை கணக்கீட்டு அடிப்படை நிலைகள் என்று அழைக்கப்படுகின்றன.',
        'நேரியல் இயற்கணித நெடுவரிசை வெக்டர் குறியீட்டில், |0⟩ = [1, 0]ᵀ மற்றும் |1⟩ = [0, 1]ᵀ. அவை செங்குத்தானவை (orthonormal) என்பதால், அவற்றின் உள் பெருக்கல் ⟨0|1⟩ = 0 மற்றும் ⟨0|0⟩ = ⟨1|1⟩ = 1 ஆகும்.',
        '|0⟩ நிலையில் தயாரிக்கப்பட்ட க்யூபிட் அளவிடப்படும் போது, அது 100% உறுதியுடன் 0 முடிவைத் தருகிறது. அதேபோல், |1⟩ 100% உறுதியுடன் 1 முடிவைத் தருகிறது.'
      ],
      keyTakeaways: [
        'கணக்கீட்டு அடிப்படை நிலைகள்: |0⟩ = [1, 0]ᵀ மற்றும் |1⟩ = [0, 1]ᵀ.',
        'அவை அனைத்து ஒற்றை க்யூபிட் நிலைகளையும் உள்ளடக்கும் ஒரு செங்குத்து அடிப்படையை உருவாக்குகின்றன.',
        'அடிப்படை நிலை |0⟩ ஐ அளவிடும் போது பிட் 0 கிடைக்கும்; |1⟩ ஐ அளவிடும் போது பிட் 1 கிடைக்கும்.'
      ]
    },
    'superposition': {
      title: 'மேற்பொருந்துதல் (Superposition)',
      tagline: 'அடிப்படை நிலைகளின் நேரியல் சேர்க்கை',
      paragraphs: [
        'ஒரு க்யூபிட் அடிப்படை நிலைகளின் நேரியல் சேர்க்கையில் (linear combination) இருக்க முடியும்: |ψ⟩ = α|0⟩ + β|1⟩, இங்கு α, β ∈ ℂ ஆகியவை நிகழ்தகவு வீச்சுகள் ஆகும்.',
        'மேற்பொருந்துதல் என்பது குவாண்டம் நிலை வெளியின் நேரியல் தன்மையின் விளைவாகும். |0⟩ நிலைக்கு ஹாடமார்ட் கேட் H ஐப் பயன்படுத்துவது சமமான மேற்பொருந்துதல் நிலையை |+⟩ = (|0⟩ + |1⟩)/√2 உருவாக்குகிறது.',
        'முக்கிய வேறுபாடு: மேற்பொருந்துதல் என்றால் க்யூபிட் ஒரே நேரத்தில் ரகசியமாக 0 மற்றும் 1 ஆக இருக்கிறது என்று அர்த்தமல்ல. க்யூபிட் ஒரு தனித்துவமான குவாண்டம் நிலையில் உள்ளது, இது அலை போன்ற ஆக்கபூர்வ மற்றும் அழிவுகர குறுக்கீடுகளை (interference) வெளிப்படுத்துகிறது.'
      ],
      keyTakeaways: [
        'நிலைச் சமன்பாடு: |ψ⟩ = α|0⟩ + β|1⟩, இதில் இயல்பாக்கம் |α|² + |β|² = 1 ஆகும்.',
        'சம மேற்பொருந்துதல் நிலை |+⟩ = H|0⟩ ஆனது 0 மற்றும் 1 ஆகிய இரண்டிற்கும் 50% நிகழ்தகவைத் தருகிறது.',
        'கணக்கீட்டு பாதைகளில் குவாண்டம் இணை செயலாக்கத்தையும் குறுக்கீட்டையும் செயல்படுத்துகிறது.'
      ]
    },
    'probability-amplitudes': {
      title: 'நிகழ்தகவு வீச்சுகள் (Probability Amplitudes)',
      tagline: 'பார்ன் விதி மற்றும் வாய்ப்புகளின் வடிவியல்',
      paragraphs: [
        '|ψ⟩ = α|0⟩ + β|1⟩ சமன்பாட்டில் உள்ள குணகங்கள் α மற்றும் β நிகழ்தகவு வீச்சுகள் என அழைக்கப்படுகின்றன. வீச்சுகள் அளவு மற்றும் கட்டம் (phase) இரண்டையும் கொண்ட சிக்கலான எண்களாகும்: α = r_0 e^(iφ_0) மற்றும் β = r_1 e^(iφ_1).',
        'பார்ன் விதியின்படி (Born\'s Rule), 0 முடிவை அளவிடுவதற்கான நிகழ்தகவு P(0) = |α|², மற்றும் 1 முடிவை அளவிடுவதற்கான நிகழ்தகவு P(1) = |β|² ஆகும். மொத்த நிகழ்தகவு எப்போதும் 1 ஆக இருக்க வேண்டும்: |α|² + |β|² = 1.',
        'அளவீட்டு நிகழ்தகவுகள் |α| மற்றும் |β| அளவுகளை மட்டுமே சார்ந்து இருந்தாலும், சார்பு கட்டம் Δφ = φ_1 - φ_0 குவாண்டம் குறுக்கீட்டின் போது அலைகள் ஆக்கபூர்வமாக இணைகிறதா அல்லது அழிவுகரமாக இணைகிறதா என்பதைத் தீர்மானிக்கிறது.'
      ],
      keyTakeaways: [
        'பார்ன் விதி: P(0) = |α|² மற்றும் P(1) = |β|².',
        'மொத்த நிகழ்தகவு மாறாமை: |α|² + |β|² = 1.',
        'சார்பு கட்டம் φ தனித்தனி நிலை நிகழ்தகவுகளை மாற்றாமல் குவாண்டம் குறுக்கீட்டைக் கட்டுப்படுத்துகிறது.'
      ]
    },
    'measurement': {
      title: 'அளவீடு (Measurement)',
      tagline: 'அலைச்சார்பு சுருங்குதல் மற்றும் கிளாசிக்கல் தகவல் பிரித்தெடுத்தல்',
      paragraphs: [
        'அளவீடு என்பது ஒரு குவாண்டம் அமைப்பிலிருந்து கிளாசிக்கல் தகவல்களைப் பிரித்தெடுக்கும் இயற்பியல் செயலாகும். அளவீட்டிற்கு முன், க்யூபிட் யூனிட்டரி ஆபரேட்டர்கள் மூலம் மீளக்கூடிய வகையில் உருவாகிறது.',
        'கணக்கீட்டு அடிப்படையில் அளவிடும் போது, மேற்பொருந்துதல் உடனடியாக |0⟩ (நிகழ்தகவு |α|² உடன்) அல்லது |1⟩ (நிகழ்தகவு |β|² உடன்) நிலைக்குச் சுருங்குகிறது (collapse).',
        'அளவீட்டு சுருக்கம் மீள முடியாதது: ஒரு முறை அளவிடப்பட்ட பிறகு, சார்பு கட்டம் மற்றும் அசல் மேற்பொருந்துதல் நிரந்தரமாக அழிக்கப்பட்டு, அடுத்தடுத்த அளவீடுகள் அதே முடிவையே தரும்.'
      ],
      keyTakeaways: [
        'குவாண்டம் நிகழ்தகவு வீச்சுகளிலிருந்து கிளாசிக்கல் பிட்களை (0 அல்லது 1) பிரித்தெடுக்கிறது.',
        'பார்ன் விதியின்படி மீள முடியாத நிலைச் சுருக்கத்தை ஏற்படுத்துகிறது.',
        'சுருங்கிய நிலையின் அடுத்தடுத்த தொடர் அளவீடுகள் ஒரே மாதிரியான முடிவுகளைத் தரும்.'
      ]
    },
    'bloch-sphere': {
      title: 'ப்ளோச் கோளம் (The Bloch Sphere)',
      tagline: 'ஒற்றை க்யூபிட்டின் வடிவியல் காட்சிப்படுத்தல்',
      paragraphs: [
        'ப்ளோச் கோளம் என்பது இரண்டு நிலை குவாண்டம் அமைப்பின் (சிங்கிள் க்யூபிட்) தூய நிலைகளுக்கான முழுமையான வடிவியல் பிரதிநிதித்துவத்தை வழங்கும் ஒரு அலகு கோளமாகும்.',
        'எந்தவொரு சிங்கிள்-க்யூபிட் தூய நிலையையும் |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ என எழுதலாம், இங்கு θ ∈ [0, π] துருவக் கோணத்தையும், φ ∈ [0, 2π) கட்டக் கோணத்தையும் குறிக்கிறது.',
        'வட துருவம் |0⟩ ஐயும், தென் துருவம் |1⟩ ஐயும், பூமத்திய ரேகை வெவ்வேறு சார்பு கட்டங்களைக் கொண்ட சம மேற்பொருந்துதல் நிலைகளையும் (|+⟩, |−⟩, |i⟩, |−i⟩) குறிக்கிறது. சிங்கிள்-க்யூபிட் குவாண்டம் கேட்கள் இந்தக் கோளத்தின் சுழற்சிகளுக்கு (rotations) இணையானவை.'
      ],
      keyTakeaways: [
        'வட துருவம் = |0⟩, தென் துருவம் = |1⟩, பூமத்திய ரேகை = சம மேற்பொருந்துதல்.',
        'துருவக் கோணம் θ முடிவு நிகழ்தகவுகளையும்; கட்டக் கோணம் φ கட்டத்தையும் கட்டுப்படுத்துகிறது.',
        'சிங்கிள்-க்யூபிட் குவாண்டம் கேட்கள் (X, Y, Z, H, S, T) ப்ளோச் கோளத்தின் வடிவியல் சுழற்சிகளாகும்.'
      ]
    }
  }
};

export const TOPIC_TRANSLATIONS: Record<string, { hi: TopicTranslation; ta: TopicTranslation }> = {
  'qubit': {
    hi: {
      topic_name: 'क्युबिट (Qubit)',
      short_definition: 'क्वांटम सूचना की मूलभूत इकाई, जो सम्मिश्र आयामों α और β के साथ अवस्था |ψ⟩ = α|0⟩ + β|1⟩ में विद्यमान होती है।',
      keywords: ['क्युबिट', 'क्वांटम बिट', 'qubit', 'क्यूपिट']
    },
    ta: {
      topic_name: 'க்யூபிட் (Qubit)',
      short_definition: 'குவாண்டம் தகவலின் அடிப்படை அலகு, |ψ⟩ = α|0⟩ + β|1⟩ என்ற குவாண்டம் நிலையில் சிக்கலான வீச்சுகளுடன் இயங்குகிறது.',
      keywords: ['க்யூபிட்', 'குவாண்டம் பிட்', 'qubit']
    }
  },
  'superposition': {
    hi: {
      topic_name: 'सुपरपोजिशन (Superposition)',
      short_definition: 'क्वांटम आधार अवस्थाओं का रैखिक संयोजन |ψ⟩ = α|0⟩ + β|1⟩, जहाँ कुल प्रायिकता |α|² + |β|² = 1 होती है।',
      keywords: ['सुपरपोजिशन', 'अध्यारोपण', 'superposition']
    },
    ta: {
      topic_name: 'மேற்பொருந்துதல் (Superposition)',
      short_definition: 'அடிப்படை நிலைகளின் நேரியல் சேர்க்கை |ψ⟩ = α|0⟩ + β|1⟩, இதில் மொத்த நிகழ்தகவு |α|² + |β|² = 1 ஆக இருக்கும்.',
      keywords: ['மேற்பொருந்துதல்', 'சூப்பர்பொசிஷன்', 'superposition']
    }
  },
  'quantum-entanglement': {
    hi: {
      topic_name: 'क्वांटम एंटैंगलमेंट (Quantum Entanglement)',
      short_definition: 'दो या अधिक क्युबिट्स की ऐसी अविभाज्य अवस्था जिसमें एक क्युबिट का मापन तुरंत दूसरे की अवस्था तय करता है।',
      keywords: ['एंटैंगलमेंट', 'क्वांटम उलझाव', 'entanglement', 'बेल अवस्था']
    },
    ta: {
      topic_name: 'குவாண்டம் பின்னல் (Quantum Entanglement)',
      short_definition: 'இரண்டு அல்லது அதற்கு மேற்பட்ட க்யூபிட்களின் பிரிக்க முடியாத நிலை, இதில் ஒன்றின் அளவீடு உடனடியாக மற்றொன்றைத் தீர்மானிக்கிறது.',
      keywords: ['குவாண்டம் பின்னல்', 'என்டாங்கிள்மென்ட்', 'entanglement', 'பெல் நிலை']
    }
  },
  'hadamard-gate': {
    hi: {
      topic_name: 'हैडामार्ड गेट (Hadamard Gate)',
      short_definition: 'सिंगल-क्युबिट गेट जो आधार अवस्थाओं |0⟩ और |1⟩ को समान सुपरपोजिशन |+⟩ और |−⟩ में रूपांतरित करता है।',
      keywords: ['हैडामार्ड गेट', 'एच गेट', 'hadamard', 'hadamard gate']
    },
    ta: {
      topic_name: 'ஹாடமார்ட் கேட் (Hadamard Gate)',
      short_definition: 'அடிப்படை நிலைகளான |0⟩ மற்றும் |1⟩ ஐ சம மேற்பொருந்துதல் நிலைகளாக மாற்றும் ஒற்றை க்யூபிட் குவாண்டம் கேட்.',
      keywords: ['ஹாடமார்ட் கேட்', 'ஹடாமார்ட்', 'hadamard gate', 'hadamard']
    }
  },
  'cnot-gate': {
    hi: {
      topic_name: 'सी-नॉट गेट (CNOT Gate)',
      short_definition: 'दो-क्युबिट नियंत्रित-NOT गेट जो कंट्रोल क्युबिट |1⟩ होने पर टारगेट क्युबिट को फ्लिप करता है; एंटैंगलमेंट उत्पन्न करने के लिए प्रयुक्त।',
      keywords: ['सी-नॉट', 'सीநॉट', 'cnot', 'controlled not']
    },
    ta: {
      topic_name: 'சி-நாட் கேட் (CNOT Gate)',
      short_definition: 'கட்டுப்பாட்டு க்யூபிட் |1⟩ ஆக இருக்கும் போது இலக்கு க்யூபிட்டை மாற்றும் இரண்டு க்யூபிட் குவாண்டம் கேட்.',
      keywords: ['சி நாட்', 'சிநாட்', 'cnot', 'cnot gate']
    }
  },
  'grovers-algorithm': {
    hi: {
      topic_name: 'ग्रोवर का एल्गोरिदम (Grover\'s Algorithm)',
      short_definition: 'असंरचित डेटाबेस में O(√N) समय में लक्षित तत्व खोजने वाला क्वांटम आयाम प्रवर्धन एल्गोरिदम।',
      keywords: ['ग्रोवर', 'ग्रोवर एल्गोरिदम', 'grover', 'grovers algorithm']
    },
    ta: {
      topic_name: 'குரோவரின் அல்காரிதம் (Grover\'s Algorithm)',
      short_definition: 'கட்டமைக்கப்படாத தரவுத்தளத்தில் O(√N) நேரத்தில் இலக்கு பதிவைத் தேடும் குவாண்டம் வீச்சு பெருக்க அல்காரிதம்.',
      keywords: ['குரோவர்', 'குரோவரின் அல்காரிதம்', 'grover', 'grovers algorithm']
    }
  },
  'deutsch-jozsa-algorithm': {
    hi: {
      topic_name: 'डॉयच-जोज़ा एल्गोरिदम (Deutsch-Jozsa Algorithm)',
      short_definition: 'केवल 1 क्वांटम क्वेरी में यह निर्धारित करने वाला एल्गोरिदम कि बूलियन फलन स्थिर (constant) है या संतुलित (balanced)।',
      keywords: ['डॉयच जोज़ा', 'ड्यूश जोजसा', 'deutsch jozsa', 'deutsch']
    },
    ta: {
      topic_name: 'டாய்ச்-ஜோசா அல்காரிதம் (Deutsch-Jozsa Algorithm)',
      short_definition: 'ஒரு பூலியன் செயல்பாடு மாறிலியா அல்லது சமநிலையானதா என்பதை ஒரே ஒரு குவாண்டம் வினவலில் தீர்மானிக்கும் அல்காரிதம்.',
      keywords: ['டாய்ச் ஜோசா', 'டாய்ச்-ஜோசா', 'deutsch jozsa']
    }
  },
  'bloch-sphere': {
    hi: {
      topic_name: 'ब्लोच गोला (Bloch Sphere)',
      short_definition: 'एकल क्युबिट अवस्था का त्रिविमीय इकाई गोला ज्यामितीय प्रतिनिधित्व, जहाँ उत्तरी ध्रुव |0⟩ और दक्षिणी ध्रुव |1⟩ है।',
      keywords: ['ब्लोच गोला', 'ब्लोच स्फेयर', 'bloch sphere']
    },
    ta: {
      topic_name: 'ப்ளோச் கோளம் (Bloch Sphere)',
      short_definition: 'ஒற்றை க்யூபிட் நிலையின் முப்பரிமாண அலகு கோள வடிவியல் பிரதிநிதித்துவம், இதில் வட துருவம் |0⟩ மற்றும் தென் துருவம் |1⟩ ஆகும்.',
      keywords: ['ப்ளோச் கோளம்', 'ப்ளொச்', 'bloch sphere']
    }
  },
  'measurement': {
    hi: {
      topic_name: 'मापन (Measurement)',
      short_definition: 'बॉर्न के नियम के अनुसार क्युबिट की सुपरपोजिशन अवस्था को निश्चित क्लासिकल बिट 0 या 1 में संकुचित करने की प्रक्रिया।',
      keywords: ['मापन', 'क्वांटम मापन', 'measurement']
    },
    ta: {
      topic_name: 'அளவீடு (Measurement)',
      short_definition: 'பார்ன் விதியின்படி க்யூபிட்டின் மேற்பொருந்துதல் நிலையை 0 அல்லது 1 ஆகச் சுருக்கும் செயல்முறை.',
      keywords: ['அளவீடு', 'குவாண்டம் அளவீடு', 'measurement']
    }
  }
};
