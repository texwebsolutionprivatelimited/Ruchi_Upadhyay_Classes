/**
 * Chapter-wise tests extracted from authentic curriculum question papers.
 * Category 'Class 9' maps directly to the Class 9 Test Series folder.
 */

export const defaultChapterTests = [
  {
    id: 'class9-ch1-matter-surroundings',
    title: 'Chapter 1: Matter in Our Surroundings',
    description: 'Comprehensive test covering States of Matter, Diffusion, Latent Heat, Evaporation, Assertion-Reason, and Case Study questions.',
    category: 'Class 9',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T10:00:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 15) ---
      {
        id: 'c9-ch1-q1',
        question: 'In which of the following conditions, the distance between the molecules of hydrogen gas would increase?\n(i) Increasing pressure on hydrogen contained in a closed container\n(ii) Some hydrogen gas leaking out of the container\n(iii) Increasing the volume of the container of hydrogen gas\n(iv) Adding more hydrogen gas to the container without increasing the volume',
        options: [
          '(i) and (iii)',
          '(i) and (iv)',
          '(ii) and (iii)',
          '(ii) and (iv)'
        ],
        correctAnswer: 2,
        explanation: 'Distance between molecules increases when density decreases: either when some gas leaks out (fewer molecules in the same volume) or when the volume of the container is increased.',
        points: 2
      },
      {
        id: 'c9-ch1-q2',
        question: 'When a gas jar full of air is placed upside down on a gas jar full of bromine vapours, the red-brown vapours of bromine from the lower jar go upward into the jar containing air. In this experiment:',
        options: [
          'Air is heavier than bromine',
          'Both air and bromine have the same density',
          'Bromine is heavier than air',
          'Bromine cannot be heavier than air because it is going upwards against gravity'
        ],
        correctAnswer: 2,
        explanation: 'Bromine vapour is denser than air, yet it moves upward against gravity due to diffusion caused by rapid random motion of particles into the large spaces between air molecules.',
        points: 2
      },
      {
        id: 'c9-ch1-q3',
        question: 'A form of matter has no fixed shape but it has a fixed volume. An example of this form of matter is:',
        options: [
          'Krypton',
          'Kerosene',
          'Carbon steel',
          'Carbon dioxide'
        ],
        correctAnswer: 1,
        explanation: 'Liquids have no fixed shape (they take the shape of the container) but possess a fixed volume. Kerosene is a liquid at room temperature.',
        points: 2
      },
      {
        id: 'c9-ch1-q4',
        question: 'Which one of the following statements is NOT true?',
        options: [
          'The molecules in a solid vibrate about a fixed position',
          'The molecules in a liquid are arranged in a regular pattern',
          'The molecules in a gas exert negligibly small forces on each other, except during collisions',
          'The molecules of a gas occupy all the space available'
        ],
        correctAnswer: 1,
        explanation: 'Molecules in liquids are not arranged in a fixed or regular pattern; they are loosely packed and free to slide over one another.',
        points: 2
      },
      {
        id: 'c9-ch1-q5',
        question: 'The correct procedure of heating iron-sulphur mixture to prepare iron sulphide is:',
        options: [
          'Heat the powder mixture at the base of the test tube using a blue flame throughout.',
          'Heat the iron filings and sulphur mixture in the middle of the test tube using yellow flame throughout.',
          'Heat the powder mixture at the top of the test tube using an orange flame throughout.',
          'Heat the iron filings-sulphur mixture at 3/4 quarters of the test tube using a red flame throughout.'
        ],
        correctAnswer: 0,
        explanation: 'The powder mixture of iron filings and sulphur should be heated at the base of the test tube using a strong, non-luminous blue flame throughout.',
        points: 2
      },
      {
        id: 'c9-ch1-q6',
        question: 'When water at 0°C freezes to form ice at the same temperature of 0°C, then it:',
        options: [
          'Absorbs some heat',
          'Releases some heat',
          'Neither absorbs nor releases heat',
          'Absorbs exactly 3.34 × 10⁵ J/kg of heat'
        ],
        correctAnswer: 1,
        explanation: 'Freezing is an exothermic process. When water turns into ice at 0°C, it releases latent heat of fusion (3.34 × 10⁵ J/kg) to the surroundings.',
        points: 2
      },
      {
        id: 'c9-ch1-q7',
        question: 'When heat is constantly supplied by a burner to boiling water, then the temperature of water during vaporisation:',
        options: [
          'Rises very slowly',
          'Rises rapidly until steam is produced',
          'First rises and then becomes constant',
          'Does not rise at all'
        ],
        correctAnswer: 3,
        explanation: 'The temperature remains constant at 100°C because the supplied heat is absorbed as latent heat of vaporization to overcome the intermolecular forces of attraction.',
        points: 2
      },
      {
        id: 'c9-ch1-q8',
        question: 'Which one of the following set of phenomena would increase on raising the temperature?',
        options: [
          'Diffusion, evaporation, compression of gases',
          'Evaporation, compression of gases, solubility',
          'Evaporation, diffusion, expansion of gases',
          'Evaporation, solubility, diffusion, compression of gases'
        ],
        correctAnswer: 2,
        explanation: 'Higher temperature increases kinetic energy of particles, accelerating evaporation, diffusion, and thermal expansion. Compression of gases decreases with rising temperature.',
        points: 2
      },
      {
        id: 'c9-ch1-q9',
        question: 'On converting 308 K, 329 K and 391 K to Celsius scale, the correct sequence of temperatures will be:',
        options: [
          '33°C, 56°C and 118°C',
          '35°C, 56°C and 119°C',
          '35°C, 56°C and 118°C',
          '56°C, 119°C and 35°C'
        ],
        correctAnswer: 2,
        explanation: '°C = K - 273. Therefore: 308 - 273 = 35°C; 329 - 273 = 56°C; 391 - 273 = 118°C.',
        points: 2
      },
      {
        id: 'c9-ch1-q10',
        question: 'Four students took a mixture of sand, common salt, and ammonium chloride in beakers, added water, stirred well, and filtered. Who reported observations in the correct order as residue and filtrate?\nStudent I: Residue = Ammonium chloride | Filtrate = Sand, Common salt\nStudent II: Residue = Common salt, Sand | Filtrate = Ammonium chloride\nStudent III: Residue = Sand, Ammonium chloride | Filtrate = Common salt\nStudent IV: Residue = Sand | Filtrate = Ammonium chloride, Common salt',
        options: [
          'Student I',
          'Student IV',
          'Student III',
          'Student II'
        ],
        correctAnswer: 1,
        explanation: 'Both common salt (NaCl) and ammonium chloride (NH₄Cl) dissolve completely in water, passing into the filtrate. Sand is insoluble and remains as residue on the filter paper.',
        points: 2
      },
      {
        id: 'c9-ch1-q11',
        question: 'Which of the following phenomena always results in the cooling effect?',
        options: [
          'Condensation',
          'Evaporation',
          'Sublimation',
          'None of these'
        ],
        correctAnswer: 1,
        explanation: 'During evaporation, particles absorb latent heat from the surroundings, resulting in a temperature drop and a noticeable cooling effect.',
        points: 2
      },
      {
        id: 'c9-ch1-q12',
        question: 'Which of the following cannot be considered a form of matter?',
        options: [
          'Atom',
          'Water',
          'Humidity',
          'Electron'
        ],
        correctAnswer: 2,
        explanation: 'Humidity represents the measure/condition of moisture present in air rather than a distinct chemical substance or physical form of matter.',
        points: 2
      },
      {
        id: 'c9-ch1-q13',
        question: 'Which of the following causes the temperature of a substance to remain constant while it is undergoing a change in its state?',
        options: [
          'Latent heat',
          'Lattice energy',
          'Loss of heat',
          'None of these'
        ],
        correctAnswer: 0,
        explanation: 'Latent heat is the thermal energy used to change the physical state by altering intermolecular spacing and bonds without altering temperature.',
        points: 2
      },
      {
        id: 'c9-ch1-q14',
        question: 'Which of the following statement is correct?',
        options: [
          'Materials existing as liquids at room temperature have their melting and boiling points lower than room temperature.',
          'The phenomenon involving the transition of a substance from solid to liquid state is called sublimation.',
          'To convert a temperature on the Celsius scale to Kelvin scale, subtract 273 from the given temperature.',
          'The density of ice is less than that of water.'
        ],
        correctAnswer: 3,
        explanation: 'Ice has an open 3D cage-like hexagonal structure with empty spaces, making its volume larger and density lower than liquid water at 0°C.',
        points: 2
      },
      {
        id: 'c9-ch1-q15',
        question: 'Which of the following statement is NOT true regarding the characteristic of matter?',
        options: [
          'Particles of a matter are randomly moving in all directions.',
          'Kinetic energy of the particles increases with a rise in temperature.',
          'Kinetic energy of the particles of all matters remains the same at a particular temperature.',
          'Particles of matter diffuse into each other on their own.'
        ],
        correctAnswer: 2,
        explanation: 'Different substances have different particle masses and forces of attraction, so the kinetic energy and molecular velocity differ across different forms of matter at the same temperature.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c9-ch1-q16',
        question: 'Assertion (A): Sugar and Salt both are easily dissolved in water.\nReason (R): Sugar and Salt are solid hence it is easily dissolved in water.',
        options: [
          'Both Assertion and Reason are correct, and Reason is the correct explanation for Assertion.',
          'Both Assertion and Reason are correct, but Reason is NOT the correct explanation for Assertion.',
          'Assertion is true but Reason is false.',
          'Both Assertion and Reason are false.'
        ],
        correctAnswer: 2,
        explanation: 'Assertion is true (sugar and salt dissolve readily). Reason is false because being a solid does not guarantee solubility; many solids (e.g. sand, glass, iron) do not dissolve in water.',
        points: 3
      },
      {
        id: 'c9-ch1-q17',
        question: 'Assertion (A): When sugar is poured into water, the taste of water becomes sweet.\nReason (R): Sugar completely dissolves in water while retaining its own sweet character.',
        options: [
          'Both Assertion and Reason are correct, and Reason is the correct explanation for Assertion.',
          'Both Assertion and Reason are correct, but Reason is NOT the correct explanation for Assertion.',
          'Assertion is true but Reason is false.',
          'Both Assertion and Reason are false.'
        ],
        correctAnswer: 0,
        explanation: 'Dissolving sugar is a physical change. Sugar molecules disperse in intermolecular spaces of water without chemical alteration, conferring their sweetness to the solution.',
        points: 3
      },

      // --- Section 3: Case Study Questions ---
      {
        id: 'c9-ch1-q18',
        question: '[Case Study 1: Melting of Ice] Crushed ice is taken in a beaker with a thermometer surrounded by ice. As heat is supplied, temperature rises gradually and becomes constant when ice starts changing to water.\n\nWhat name is associated with the conversion of ice into water?',
        options: [
          'Evaporation',
          'Sublimation',
          'Freezing',
          'Fusion of Solid'
        ],
        correctAnswer: 3,
        explanation: 'The transition from solid state to liquid state upon absorbing heat is called fusion (melting).',
        points: 2
      },
      {
        id: 'c9-ch1-q19',
        question: '[Case Study 1: Melting of Ice]\nWhat specific name is given to the constant temperature maintained during the conversion of ice to water?',
        options: [
          'Latent heat of fusion',
          'Boiling Point',
          'Melting Point',
          'Condensation point'
        ],
        correctAnswer: 2,
        explanation: 'The constant temperature at which a solid melts into liquid at 1 atmospheric pressure is its melting point (0°C or 273.15 K for ice).',
        points: 2
      },
      {
        id: 'c9-ch1-q20',
        question: '[Case Study 1: Melting of Ice]\nThe heat energy supplied to the system at constant temperature during melting is known as:',
        options: [
          'Specific heat',
          'Latent heat',
          'Residual heat',
          'None of the above'
        ],
        correctAnswer: 1,
        explanation: 'Latent heat ("hidden heat") is the thermal energy absorbed during a phase change without altering the temperature.',
        points: 2
      },
      {
        id: 'c9-ch1-q21',
        question: '[Case Study 1: Melting of Ice]\nWhere does the heat energy go when the temperature does not rise during melting?',
        options: [
          'It makes the molecular motion of the liquid faster',
          'It raises the temperature of the beaker only',
          'It is utilised for bringing out the complete change of state by overcoming intermolecular attractions',
          'It slows down the molecular motion'
        ],
        correctAnswer: 2,
        explanation: 'The latent heat of fusion is consumed in breaking down the rigid intermolecular bonds of the ice crystal lattice rather than increasing kinetic energy.',
        points: 2
      },
      {
        id: 'c9-ch1-q22',
        question: '[Case Study 2: Hot Air Balloon]\nA hot air balloon consists of the basket (made of wicker for comfort & low weight), the burner, and the envelope holding hot air.\n\nBased on density and temperature principles, which of the following statements is NOT true?',
        options: [
          'Air goes up and out the top of a chimney when you light a fire.',
          'Cool air collects about the ceiling when you open a refrigerator.',
          'Smoke from a candle rises after you blow out the flame.',
          'Cold air coming from an air conditioning vent settles about the floor.'
        ],
        correctAnswer: 1,
        explanation: '"Hot air rises and cold air falls." The cool, dense air from inside the refrigerator descends towards the floor rather than rising towards the ceiling.',
        points: 2
      },
      {
        id: 'c9-ch1-q23',
        question: '[Case Study 2: Hot Air Balloon]\nAccording to the passage, wicker is chosen for the passenger basket because it is:\nI. Comfortable\nII. Light weight\nIII. Durable',
        options: [
          'I only',
          'I and II only',
          'II and III only',
          'I, II and III'
        ],
        correctAnswer: 1,
        explanation: 'The passage explicitly mentions: "The basket is usually made of wicker. This ensures that it will be comfortable and add little extra weight."',
        points: 2
      }
    ]
  },
  {
    id: 'class9-ch2-is-matter-around-us-pure',
    title: 'Chapter 2: Is Matter Around Us Pure',
    description: 'Comprehensive test covering Pure Substances, Mixtures, Solutions, Colloids, Suspensions, Separation Techniques, Chromatography, Assertion-Reason, and Case Study questions.',
    category: 'Class 9',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T14:15:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 15) ---
      {
        id: 'c9-ch2-q1',
        question: 'What is the name of the metal which exists in liquid state at room temperature?',
        options: [
          'sodium',
          'potassium',
          'mercury',
          'bromine'
        ],
        correctAnswer: 2,
        explanation: 'Mercury (Hg) is the only metal that is liquid at room temperature (25°C).',
        points: 2
      },
      {
        id: 'c9-ch2-q2',
        question: 'When the liquid is spun rapidly, the denser particles are forced to the bottom and the lighter particles stay at the top. This principle is used in:',
        options: [
          'centrifugation',
          'fractional distillation',
          'evaporation',
          'tunneling'
        ],
        correctAnswer: 0,
        explanation: 'Centrifugation works on centrifugal force where denser particles are forced to the bottom and lighter particles stay on top when spun rapidly.',
        points: 2
      },
      {
        id: 'c9-ch2-q3',
        question: 'What is the name of the non-metal which exists in liquid state at room temperature?',
        options: [
          'mercury',
          'bromine',
          'sodium',
          'potassium'
        ],
        correctAnswer: 1,
        explanation: 'Bromine (Br) is the only non-metallic element that exists as a liquid at room temperature.',
        points: 2
      },
      {
        id: 'c9-ch2-q4',
        question: 'Which of the following elements is not a metalloid?',
        options: [
          'boron',
          'silicon',
          'germanium',
          'tungsten'
        ],
        correctAnswer: 3,
        explanation: 'Boron, silicon, and germanium are metalloids having intermediate properties. Tungsten is a transition metal.',
        points: 2
      },
      {
        id: 'c9-ch2-q5',
        question: 'If we put camphor in an open container, its amount keeps on decreasing due to the phenomenon of:',
        options: [
          'evaporation',
          'precipitation',
          'condensation',
          'sublimation'
        ],
        correctAnswer: 3,
        explanation: 'Camphor is a volatile solid that undergoes sublimation, changing directly from solid to gas without melting into liquid.',
        points: 2
      },
      {
        id: 'c9-ch2-q6',
        question: 'A heterogeneous mixture in which the solute particles do not dissolve and remain suspended throughout the solvent and can be seen with the naked eye is known as:',
        options: [
          'colloidal solution',
          'super saturated solution',
          'sublimation',
          'suspensions'
        ],
        correctAnswer: 3,
        explanation: 'Suspensions are heterogeneous mixtures with particle size greater than 100 nm where solute particles do not dissolve and remain visible to the naked eye.',
        points: 2
      },
      {
        id: 'c9-ch2-q7',
        question: 'In tincture of iodine, find the solute and solvent:',
        options: [
          'alcohol is the solute and iodine is the solvent',
          'iodine is the solute and alcohol is the solvent',
          'any component can be considered as solute or solvent',
          'tincture of iodine is not a solution'
        ],
        correctAnswer: 1,
        explanation: 'Tincture of iodine is an antiseptic solution where iodine (solid) is the solute dissolved in alcohol (liquid) which acts as the solvent.',
        points: 2
      },
      {
        id: 'c9-ch2-q8',
        question: 'The continuous zig-zag movement of colloidal particles in a dispersion medium is called:',
        options: [
          'dispersion',
          'tyndall effect',
          'brownian movement',
          'oscillation'
        ],
        correctAnswer: 2,
        explanation: 'Brownian movement is the continuous random zig-zag motion of colloidal particles caused by unbalanced collisions with dispersion medium molecules.',
        points: 2
      },
      {
        id: 'c9-ch2-q9',
        question: 'A pure substance which is made up of only one kind of atom and cannot be broken into two or more simpler substances by physical or chemical means is referred to as:',
        options: [
          'a compound',
          'an element',
          'a molecule',
          'a mixture'
        ],
        correctAnswer: 1,
        explanation: 'An element is a pure substance consisting of only one kind of atom that cannot be chemically decomposed into simpler substances.',
        points: 2
      },
      {
        id: 'c9-ch2-q10',
        question: 'Which of the following non-metal is a good conductor of electricity?',
        options: [
          'aluminium',
          'silicon',
          'graphite',
          'gold'
        ],
        correctAnswer: 2,
        explanation: 'Graphite is a non-metal (allotrope of carbon) that conducts electricity due to free delocalized valence electrons in its layered hexagonal structure.',
        points: 2
      },
      {
        id: 'c9-ch2-q11',
        question: 'Which of the following property does NOT describe a compound?',
        options: [
          'it is composed of two or more elements',
          'it is a pure substance',
          'it cannot be separated into constituents by physical means',
          'it is mixed in any proportion by mass'
        ],
        correctAnswer: 3,
        explanation: 'Compounds always combine in a fixed ratio by mass according to the Law of Definite Proportions. Mixing in any proportion describes a mixture, not a compound.',
        points: 2
      },
      {
        id: 'c9-ch2-q12',
        question: 'When two liquids do not mix, they form two separate layers and are known as:',
        options: [
          'miscible liquids',
          'immiscible liquids',
          'saturated liquids',
          'super saturated liquids'
        ],
        correctAnswer: 1,
        explanation: 'Liquids that do not dissolve in each other and form distinct separate layers (such as oil and water) are called immiscible liquids.',
        points: 2
      },
      {
        id: 'c9-ch2-q13',
        question: 'How can one separate ammonium chloride from a mixture containing ammonium chloride and sodium chloride?',
        options: [
          'precipitation',
          'sublimation',
          'chromatography',
          'centrifugation'
        ],
        correctAnswer: 1,
        explanation: 'Ammonium chloride sublimes on heating directly into gas and deposits on the cooler surface, leaving behind non-sublimable sodium chloride.',
        points: 2
      },
      {
        id: 'c9-ch2-q14',
        question: 'The amount of solute present per unit volume or per unit mass of the solution/solvent is known as:',
        options: [
          'composition of solute',
          'concentration of a solvent',
          'concentration of a solute',
          'concentration of a solution'
        ],
        correctAnswer: 3,
        explanation: 'Concentration of a solution is defined as the amount of solute present in a given mass or volume of solution (or solvent).',
        points: 2
      },
      {
        id: 'c9-ch2-q15',
        question: 'According to the definition of pure substance, which of the following is a pure substance?',
        options: [
          'ice',
          'mercury',
          'iron',
          'all of these'
        ],
        correctAnswer: 3,
        explanation: 'Ice (pure chemical compound H₂O), mercury (element Hg), and iron (element Fe) all consist of only one type of particle with fixed composition, making all of them pure substances.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c9-ch2-q16',
        question: 'Assertion (A): Oxygen atom is a pure substance.\nReason (R): Oxygen is never found in any combined state.',
        options: [
          'Both assertion and reason are correct, and reason is the correct explanation for assertion.',
          'Both assertion and reason are correct, but reason is NOT the correct explanation for assertion.',
          'Assertion is true but reason is false.',
          'Both assertion and reason are false.'
        ],
        correctAnswer: 2,
        explanation: 'Assertion is true (oxygen is an element and pure substance). Reason is false because oxygen is extremely reactive and widely found in combined states (water, oxides, carbonates).',
        points: 3
      },
      {
        id: 'c9-ch2-q17',
        question: 'Assertion (A): Oxygen atom is a pure substance.\nReason (R): Oxygen is always found in combined state in nature.',
        options: [
          'Both assertion and reason are correct, and reason is the correct explanation for assertion.',
          'Both assertion and reason are correct, but reason is NOT the correct explanation for assertion.',
          'Assertion is true but reason is false.',
          'Both assertion and reason are false.'
        ],
        correctAnswer: 1,
        explanation: 'Both statements are factually correct (oxygen atoms form elements/compounds which are pure, and elemental oxygen exists as O₂ molecule or oxides in nature), but Reason is not the explanation of why oxygen is classified as a pure substance.',
        points: 3
      },

      // --- Section 3: Case Study 1 ---
      {
        id: 'c9-ch2-q18',
        question: '[Case Study 1: Methods of Separation]\nWhich method should be used to separate fine mud particles suspended in water?',
        options: [
          'winnowing',
          'sedimentation and decantation',
          'using magnet',
          'chlorination'
        ],
        correctAnswer: 1,
        explanation: 'Fine mud particles settle at the bottom through sedimentation, and the clear supernatant water can be separated by decantation.',
        points: 2
      },
      {
        id: 'c9-ch2-q19',
        question: '[Case Study 1: Methods of Separation]\nWhich method is most suitable to separate oil from water?',
        options: [
          'sedimentation and decantation',
          'filtration',
          'separating funnel',
          'winnowing'
        ],
        correctAnswer: 2,
        explanation: 'Oil and water are immiscible liquids with different densities; a separating funnel is used to draw off the heavier water layer first.',
        points: 2
      },
      {
        id: 'c9-ch2-q20',
        question: '[Case Study 1: Methods of Separation]\nWhich method is used to separate sodium chloride from its solution in water?',
        options: [
          'filtration',
          'separating funnel',
          'sedimentation and decantation',
          'evaporation'
        ],
        correctAnswer: 3,
        explanation: 'Evaporation vaporizes the liquid water, leaving dry solid crystals of sodium chloride behind.',
        points: 2
      },
      {
        id: 'c9-ch2-q21',
        question: '[Case Study 1: Methods of Separation]\nWhich method separates a mixture of camphor and common salt?',
        options: [
          'filtration',
          'separating funnel',
          'sublimation',
          'sedimentation'
        ],
        correctAnswer: 2,
        explanation: 'Camphor sublimes upon heating while salt remains unaffected, allowing clean separation by sublimation.',
        points: 2
      },
      {
        id: 'c9-ch2-q22',
        question: '[Case Study 1: Methods of Separation]\nWhich method is employed to separate cream from milk?',
        options: [
          'separating funnel',
          'sedimentation',
          'filtration',
          'centrifugation'
        ],
        correctAnswer: 3,
        explanation: 'Centrifugation rapidly spins milk, causing the denser skimmed liquid to move outward and the lighter cream to separate at the center.',
        points: 2
      },

      // --- Section 4: Case Study 2 ---
      {
        id: 'c9-ch2-q23',
        question: '[Case Study 2: Paper Chromatography]\nA student marked an ink line on filter paper placed in water to separate dye components.\n\nIdentify the technique used by the student:',
        options: [
          'sedimentation',
          'filtration',
          'chromatography',
          'distillation'
        ],
        correctAnswer: 2,
        explanation: 'Paper chromatography is the technique used to separate solutes (dyes) based on their relative solubility in a mobile solvent.',
        points: 2
      },
      {
        id: 'c9-ch2-q24',
        question: '[Case Study 2: Paper Chromatography]\nWhat would you expect to see if the ink contains three different coloured components?',
        options: [
          'we will not see any band on the filter paper',
          'we would see three bands on the filter paper at various lengths',
          'we would see infinite bands on the filter paper',
          'we would see single band on the filter paper'
        ],
        correctAnswer: 1,
        explanation: 'Each coloured dye has a different solubility and travels at a different rate with the ascending water, producing three distinct bands at different heights.',
        points: 2
      },
      {
        id: 'c9-ch2-q25',
        question: '[Case Study 2: Paper Chromatography]\nGive one practical application of chromatography:',
        options: [
          'to separate salt from sand',
          'to separate wheat from husk',
          'to separate oil from water',
          'to separate drugs from blood'
        ],
        correctAnswer: 3,
        explanation: 'Chromatography is widely used in pathology and forensic science to detect and separate pharmaceutical drugs or poisons from blood samples.',
        points: 2
      },
      {
        id: 'c9-ch2-q26',
        question: '[Case Study 2: Paper Chromatography]\nFor the separation of what kind of substances is chromatography used?',
        options: [
          'for the separation of insoluble substances',
          'for the separation of single solute that dissolves in single solvent',
          'for the separation of those solutes that dissolve in the same solvent',
          'for the separation of those solutes that dissolve in different solvents'
        ],
        correctAnswer: 2,
        explanation: 'Chromatography is applied to separate two or more dissolved solutes that share the same solvent but have different solubility rates.',
        points: 2
      },
      {
        id: 'c9-ch2-q27',
        question: '[Case Study 2: Paper Chromatography]\nWhat is chromatography?',
        options: [
          'it is an agricultural method to separate grains',
          'a method to separate magnetic impurities from non-magnetic impurities',
          'the process of separating the suspended particles of an insoluble substance',
          'method of separating and identifying various components in a mixture, which are present in small trace quantities'
        ],
        correctAnswer: 3,
        explanation: 'Chromatography is a laboratory technique for the separation and identification of components of a mixture present in minute/trace amounts.',
        points: 2
      }
    ]
  },
  {
    id: 'class9-ch3-atoms-and-molecules',
    title: 'Chapter 3: Atoms and Molecules',
    description: 'Comprehensive test covering Laws of Chemical Combination, Dalton Atomic Theory, Atoms & Molecules, Ions, Chemical Formulae, Molecular & Formula Unit Mass, Mole Concept, Assertion-Reason, and Case Study questions.',
    category: 'Class 9',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T15:20:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 15) ---
      {
        id: 'c9-ch3-q1',
        question: 'Which of the following correctly represents 360g of water?\n(i) 2 moles of water\n(ii) 20 moles of water\n(iii) 6.022 × 10²³ molecules of water\n(iv) 1.2044 × 10²⁵ molecules of water',
        options: [
          '(i)',
          '(i) and (iv)',
          '(ii) and (iii)',
          '(ii) and (iv)'
        ],
        correctAnswer: 3,
        explanation: 'Molar mass of water (H₂O) = 18 g/mol. Number of moles = 360 / 18 = 20 moles. Number of molecules = 20 × 6.022 × 10²³ = 1.2044 × 10²⁵ molecules.',
        points: 2
      },
      {
        id: 'c9-ch3-q2',
        question: 'Which of the following statements is not true about an atom?',
        options: [
          'Atoms are not able to exist independently.',
          'Atoms are the basic units from which molecules and ions are formed.',
          'Atoms are always neutral in nature.',
          'Atoms aggregate in large numbers to form the matter that we can see, feel or touch.'
        ],
        correctAnswer: 3,
        explanation: 'Individual atoms do not aggregate directly to form bulk matter that we can see, feel, or touch; instead, atoms join together to form molecules or ions, which then cluster to build macroscopic matter.',
        points: 2
      },
      {
        id: 'c9-ch3-q3',
        question: '1 u or 1 amu means:',
        options: [
          '1/12th mass of C-12 atom',
          'Mass of C-12 atom',
          'Mass of O-16 atom',
          'Mass of Hydrogen molecule'
        ],
        correctAnswer: 0,
        explanation: 'One unified atomic mass unit (1 u) is defined as exactly 1/12th the mass of one atom of carbon-12 (C-12).',
        points: 2
      },
      {
        id: 'c9-ch3-q4',
        question: 'Which of the following contains maximum number of molecules?',
        options: [
          '1g CO₂',
          '1g N₂',
          '1g H₂',
          '1g CH₄'
        ],
        correctAnswer: 2,
        explanation: 'Number of molecules = (mass / molar mass) × N₀. H₂ has the smallest molar mass (2 g/mol), yielding 0.5 moles of molecules, which is the highest quantity among the given choices.',
        points: 2
      },
      {
        id: 'c9-ch3-q5',
        question: 'A sample of NH₃ molecule irrespective of source contains 82.35% Nitrogen and 17.65% of Hydrogen by mass. This data supports:',
        options: [
          'Law of Conservation of Mass',
          'Law of Multiple Proportions',
          'Law of Definite Proportions',
          'Avogadro\'s Law'
        ],
        correctAnswer: 2,
        explanation: 'The Law of Definite Proportions states that in any chemical compound, elements are always combined in a fixed and constant proportion by mass, irrespective of origin.',
        points: 2
      },
      {
        id: 'c9-ch3-q6',
        question: 'An element X is divalent and another element Y is tetravalent. The compound formed by these two elements will be:',
        options: [
          'XY',
          'XY₂',
          'X₂Y',
          'XY₄'
        ],
        correctAnswer: 1,
        explanation: 'According to the official answer key, valencies of X and Y combine to produce XY₂.',
        points: 2
      },
      {
        id: 'c9-ch3-q7',
        question: 'The molecular formula of potassium nitrate is _______.',
        options: [
          'KNO₃',
          'KNO',
          'KNO₂',
          'KON'
        ],
        correctAnswer: 0,
        explanation: 'Potassium ion has a valency of +1 (K⁺) and nitrate radical has a valency of -1 (NO₃⁻). Criss-crossing valencies yields KNO₃.',
        points: 2
      },
      {
        id: 'c9-ch3-q8',
        question: '3.42 g of sucrose (C₁₂H₂₂O₁₁) are dissolved in 18 g of water in a beaker. The numbers of oxygen atoms in the solution are:',
        options: [
          '6.68 × 10²³',
          '6.09 × 10²²',
          '6.022 × 10²³',
          '6.022 × 10²¹'
        ],
        correctAnswer: 0,
        explanation: 'Moles of sucrose = 3.42 / 342 = 0.01 mol (contains 0.11 mol O atoms). Moles of water = 18 / 18 = 1.0 mol (contains 1.0 mol O atoms). Total moles of oxygen = 1.11 mol. Total atoms = 1.11 × 6.022 × 10²³ ≈ 6.68 × 10²³.',
        points: 2
      },
      {
        id: 'c9-ch3-q9',
        question: 'Molecular mass is defined as the:',
        options: [
          'Mass of one molecule of any substance compared with the mass of one atom of C - 12',
          'Mass of one atom compared with the mass of one atom of hydrogen',
          'Mass of one atom compared with the mass of one molecule',
          'None of the above'
        ],
        correctAnswer: 0,
        explanation: 'Relative molecular mass expresses how many times the mass of one molecule of a substance is heavier compared to 1/12th the mass of one carbon-12 atom.',
        points: 2
      },
      {
        id: 'c9-ch3-q10',
        question: 'A change in the physical state can be brought about:',
        options: [
          'only when energy is given to the system',
          'only when energy is taken out from the system',
          'When energy is either given to, or taken out from the system',
          'Without any energy change'
        ],
        correctAnswer: 2,
        explanation: 'Phase transitions occur either by absorbing heat energy (solid to liquid to gas) or by releasing heat energy (gas to liquid to solid).',
        points: 2
      },
      {
        id: 'c9-ch3-q11',
        question: 'The atomic mass of sodium is 23. The number of moles in 46g of sodium is _______.',
        options: [
          '4',
          '2',
          '0',
          '½'
        ],
        correctAnswer: 1,
        explanation: 'Number of moles = Given mass / Molar mass = 46 / 23 = 2 moles.',
        points: 2
      },
      {
        id: 'c9-ch3-q12',
        question: 'Which of the following represents a correct chemical formula?',
        options: [
          'CaCl',
          'BiPO₄',
          'NaSO₄',
          'NaS'
        ],
        correctAnswer: 1,
        explanation: 'Bismuth has valency +3 (Bi³⁺) and phosphate has valency -3 (PO₄³⁻), forming the neutral compound BiPO₄.',
        points: 2
      },
      {
        id: 'c9-ch3-q13',
        question: 'What is the formula unit mass of ZnO? (Atomic masses: Zn = 65 u, O = 16 u)',
        options: [
          '18 u',
          '81 u',
          '88 u',
          '188 u'
        ],
        correctAnswer: 1,
        explanation: 'Formula unit mass of ZnO = 65 + 16 = 81 u.',
        points: 2
      },
      {
        id: 'c9-ch3-q14',
        question: 'How many atoms of oxygen are present in 300 grams of CaCO₃?',
        options: [
          '54.207 × 10²³',
          '6.207 × 10²³',
          '12.207 × 10²³',
          '22.2 × 10²³'
        ],
        correctAnswer: 0,
        explanation: 'Molar mass of CaCO₃ = 100 g/mol. Moles = 300 / 100 = 3 mol. Since 1 molecule has 3 oxygen atoms, total oxygen atoms = 3 × 3 × 6.022 × 10²³ = 54.207 × 10²³ atoms.',
        points: 2
      },
      {
        id: 'c9-ch3-q15',
        question: 'Which of the following represents the correct relation between Avogadro\'s number (N₀), number of particles (N) and moles (n)?',
        options: [
          'n = N / N₀',
          'n = N₀ / N',
          'n = N · N₀',
          'all are correct'
        ],
        correctAnswer: 0,
        explanation: 'Number of moles (n) equals the total number of particles (N) divided by Avogadro\'s number (N₀), i.e., n = N / N₀.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c9-ch3-q16',
        question: 'Assertion (A): Atom is the smallest unit of molecule.\nReason (R): Atom is not seen by our naked eyes.',
        options: [
          'Both Assertion and Reason are correct, and reason is the correct explanation for assertion.',
          'Both Assertion and Reason are correct, and Reason is not the correct explanation for Assertion.',
          'Assertion is true but Reason is false.',
          'Both Assertion and Reason are false.'
        ],
        correctAnswer: 1,
        explanation: 'Both statements are true facts, but the reason that atoms cannot be seen with the naked eye does not explain why an atom is the fundamental building unit of a molecule.',
        points: 3
      },
      {
        id: 'c9-ch3-q17',
        question: 'Assertion (A): Atom is the smallest unit of molecule.\nReason (R): Atoms are combined with each other forming molecule.',
        options: [
          'Both Assertion and Reason are correct, and reason is the correct explanation for assertion.',
          'Both Assertion and Reason are correct, and Reason is not the correct explanation for Assertion.',
          'Assertion is true but Reason is false.',
          'Both Assertion and Reason are false.'
        ],
        correctAnswer: 1,
        explanation: 'Both Assertion and Reason are correct statements about atomic combination and molecular structure.',
        points: 3
      },

      // --- Section 3: Case Study 1 ---
      {
        id: 'c9-ch3-q18',
        question: '[Case Study 1: Binary Compounds & Chemical Formulae]\nWhich of the following statements correctly justifies that crystallisation technique is considered better than simple evaporation to purify solids?',
        options: [
          'Solid decompose or get charred on heating to dryness.',
          'Impurities may remain dissolved in the solution even after filtration.',
          'Both (a) and (b)',
          'Impurities are easily removed in solution.'
        ],
        correctAnswer: 2,
        explanation: 'Crystallisation is superior because some solids decompose or char on dry heating, and soluble impurities remain behind in the mother liquor rather than contaminating the crystals.',
        points: 2
      },
      {
        id: 'c9-ch3-q19',
        question: '[Case Study 1: Binary Compounds & Chemical Formulae]\nIn magnesium chloride, how many chloride ions are present for each magnesium ion?',
        options: [
          'one',
          'two',
          'three',
          'four'
        ],
        correctAnswer: 1,
        explanation: 'Magnesium has a valency of +2 (Mg²⁺) and chloride has -1 (Cl⁻). Therefore, two chloride ions combine with one magnesium ion to form MgCl₂.',
        points: 2
      },
      {
        id: 'c9-ch3-q20',
        question: '[Case Study 1: Binary Compounds & Chemical Formulae]\nThe molecular mass of nitric acid (HNO₃) is:',
        options: [
          '63 u',
          '7 u',
          '54 u',
          '45 u'
        ],
        correctAnswer: 0,
        explanation: 'Molecular mass of HNO₃ = 1(H) + 14(N) + 3 × 16(O) = 1 + 14 + 48 = 63 u.',
        points: 2
      },
      {
        id: 'c9-ch3-q21',
        question: '[Case Study 1: Binary Compounds & Chemical Formulae]\nThe formula unit mass of CaCl₂ is: (Atomic masses: Ca = 40 u, Cl = 35.5 u)',
        options: [
          '111 u',
          '342 u',
          '213 u',
          '122 u'
        ],
        correctAnswer: 0,
        explanation: 'Formula unit mass of CaCl₂ = 40 + (2 × 35.5) = 40 + 71 = 111 u.',
        points: 2
      },
      {
        id: 'c9-ch3-q22',
        question: '[Case Study 1: Binary Compounds & Chemical Formulae]\nThe formula unit mass of a substance is:',
        options: [
          'the sum of the atomic masses of all atoms in a formula unit',
          'the sum of the atomic mass of only one atom',
          'both (a) and (b)',
          'none of these'
        ],
        correctAnswer: 0,
        explanation: 'Formula unit mass of a substance is calculated by summing the atomic masses of all atoms present in one formula unit of the compound.',
        points: 2
      },

      // --- Section 4: Case Study 2 ---
      {
        id: 'c9-ch3-q23',
        question: '[Case Study 2: Atomic Dimensions & Chemical Symbols]\n1 metre (m) is equal to how many nanometres (nm)?',
        options: [
          '10¹⁰ nm',
          '10⁹ nm',
          '10⁸ nm',
          '10⁶ nm'
        ],
        correctAnswer: 1,
        explanation: '1 nanometre (nm) = 10⁻⁹ metre, which means 1 metre = 10⁹ nanometres.',
        points: 2
      },
      {
        id: 'c9-ch3-q24',
        question: '[Case Study 2: Atomic Dimensions & Chemical Symbols]\n\'S\' is the chemical symbol of which element?',
        options: [
          'sulphur',
          'iron',
          'silver',
          'mercury'
        ],
        correctAnswer: 0,
        explanation: '\'S\' is the chemical symbol for Sulphur. Iron is Fe, Silver is Ag, and Mercury is Hg.',
        points: 2
      },
      {
        id: 'c9-ch3-q25',
        question: '[Case Study 2: Atomic Dimensions & Chemical Symbols]\nWho suggested that the symbols of elements are made from one or two letters of the element\'s name?',
        options: [
          'Proust',
          'Berzelius',
          'Boyle',
          'Robert'
        ],
        correctAnswer: 1,
        explanation: 'Jöns Jacob Berzelius proposed that symbols of elements should be derived from the initial one or two letters of their names.',
        points: 2
      },
      {
        id: 'c9-ch3-q26',
        question: '[Case Study 2: Atomic Dimensions & Chemical Symbols]\nLaw of constant proportion was given by:',
        options: [
          'Proust',
          'Lavoisier',
          'Dalton',
          'Berzelius'
        ],
        correctAnswer: 0,
        explanation: 'The Law of Constant (or Definite) Proportions was stated by Joseph Proust in 1799.',
        points: 2
      },
      {
        id: 'c9-ch3-q27',
        question: '[Case Study 2: Atomic Dimensions & Chemical Symbols]\nWhat is the full form of IUPAC?',
        options: [
          'International Union of Pure and Applied Chemistry',
          'International Unity of Pure and Applied Chemistry',
          'Indian Union of Pure and Applied Chemistry',
          'none of these'
        ],
        correctAnswer: 0,
        explanation: 'IUPAC stands for International Union of Pure and Applied Chemistry.',
        points: 2
      }
    ]
  },
  {
    id: 'class9-ch4-structure-of-the-atom',
    title: 'Chapter 4: Structure of the Atom',
    description: 'Comprehensive test covering Discovery of Subatomic Particles, Thomson Model, Rutherford Alpha Scattering, Bohr Model, Valence Electrons, Valency, Isotopes & Isobars, Assertion-Reason, and Case Study questions.',
    category: 'Class 9',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T15:25:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 15) ---
      {
        id: 'c9-ch4-q1',
        question: 'Who discovered the electron?',
        options: [
          'Rutherford',
          'Chadwick',
          'Thomson',
          'Goldstein'
        ],
        correctAnswer: 2,
        explanation: 'J.J. Thomson discovered the electron in 1897 through his cathode ray tube experiment.',
        points: 2
      },
      {
        id: 'c9-ch4-q2',
        question: 'Which isotope is used in nuclear power plants to generate electricity?',
        options: [
          'Uranium-235',
          'Iodine-131',
          'Cobalt-60',
          'Uranium-238'
        ],
        correctAnswer: 0,
        explanation: 'Uranium-235 (U-235) undergoes nuclear fission in nuclear reactors and is used as a fuel to generate nuclear electricity.',
        points: 2
      },
      {
        id: 'c9-ch4-q3',
        question: 'Why was Thomson\'s Model of an atom failed?\n(i) It could not explain the screening of negative charges from that of positive\n(ii) It did not tell about the presence of electrons\n(iii) It did not give an idea about the discrete energy levels\n(iv) It explained the atom as a whole to be electrically neutral\n\nChoose the correct option from the following:',
        options: [
          'Only (iii)',
          'Both (i) & (iii)',
          'Only (i)',
          'Both (ii) & (iv)'
        ],
        correctAnswer: 1,
        explanation: 'Thomson\'s model failed because it could not explain the screening of negative charges from positive charges and had no concept of discrete stationary energy levels.',
        points: 2
      },
      {
        id: 'c9-ch4-q4',
        question: 'What was the source of alpha (α) particles in Rutherford\'s scattering experiment?',
        options: [
          'Hydrogen nucleus',
          'Argon nucleus',
          'Helium nucleus',
          'None of these'
        ],
        correctAnswer: 2,
        explanation: 'Alpha particles are doubly-charged helium ions (He²⁺), essentially helium nuclei with mass 4 u and charge +2.',
        points: 2
      },
      {
        id: 'c9-ch4-q5',
        question: 'What property of an element determines its chemical behaviour?',
        options: [
          'Size of an element',
          'Valency of an element',
          'Molar mass of the element',
          'None of these'
        ],
        correctAnswer: 1,
        explanation: 'The valency (and valence electrons) of an element dictates its combining capacity and chemical reactivity.',
        points: 2
      },
      {
        id: 'c9-ch4-q6',
        question: 'Which of the following does NOT match the characteristics of an Isotope?',
        options: [
          'Isotopes of some elements are radioactive',
          'Isotopes are the atoms of different elements',
          'Isotopes differ in number of neutrons',
          'Isotopes have similar chemical properties'
        ],
        correctAnswer: 1,
        explanation: 'Isotopes are atoms of the SAME chemical element having the same atomic number (protons) but different mass numbers (neutrons).',
        points: 2
      },
      {
        id: 'c9-ch4-q7',
        question: 'Which of the two will be chemically more reactive: Sulphur (S) with atomic number 16 or Chlorine (Cl) with atomic number 17?',
        options: [
          'Chlorine',
          'Sulphur',
          'Both are equally reactive',
          'Can\'t say'
        ],
        correctAnswer: 0,
        explanation: 'Chlorine (electronic configuration 2, 8, 7) requires only 1 electron to complete its octet, whereas Sulphur (2, 8, 6) requires 2 electrons. Hence, Chlorine has higher electronegativity and chemical reactivity.',
        points: 2
      },
      {
        id: 'c9-ch4-q8',
        question: 'Which of the following elements does NOT exhibit electrovalency?',
        options: [
          'Sodium',
          'Calcium',
          'Carbon',
          'Chlorine'
        ],
        correctAnswer: 2,
        explanation: 'Carbon has 4 valence electrons and forms covalent bonds through sharing of electrons; it does not form ionic/electrovalent bonds.',
        points: 2
      },
      {
        id: 'c9-ch4-q9',
        question: 'Which of the following statements is incorrect about the structure of an atom?\n(i) The whole mass of an atom is concentrated in the nucleus\n(ii) The atom is an indivisible particle\n(iii) The atom as a whole is neutral\n(iv) All the atoms are stable in their basic state\n\nChoose the right option among the following:',
        options: [
          '(i) and (iii)',
          'only (ii)',
          '(ii) and (iv)',
          'none of these'
        ],
        correctAnswer: 2,
        explanation: 'Statements (ii) and (iv) are incorrect: atoms are divisible into subatomic particles (protons, neutrons, electrons), and many isolated atoms with incomplete octets are reactive and not stable in their free basic state.',
        points: 2
      },
      {
        id: 'c9-ch4-q10',
        question: 'Which scientist gave the concept of fixed discrete energy levels around the nucleus?',
        options: [
          'Ernest Rutherford',
          'Neils Bohr',
          'J.J. Thomson',
          'None of these'
        ],
        correctAnswer: 1,
        explanation: 'Niels Bohr in 1913 proposed that electrons revolve in discrete non-radiating orbits (fixed energy levels or shells K, L, M, N).',
        points: 2
      },
      {
        id: 'c9-ch4-q11',
        question: 'What prevents an atom from collapsing?',
        options: [
          'The nuclear forces',
          'Movement of electrons in discrete energy levels',
          'The electron-electron repulsions',
          'All of these'
        ],
        correctAnswer: 1,
        explanation: 'Electrons revolve in discrete stationary orbits without radiating electromagnetic energy, preventing them from spiraling into the nucleus.',
        points: 2
      },
      {
        id: 'c9-ch4-q12',
        question: 'Which of the following pairs are isobars?',
        options: [
          '¹⁷Cl³⁵ & ¹⁷Cl³⁷',
          '¹⁸Ar⁴⁰ & ²⁰Ca⁴⁰',
          '⁶C¹² & ⁶C¹⁴',
          'None of these'
        ],
        correctAnswer: 1,
        explanation: 'Isobars are atoms of different elements having different atomic numbers but the SAME mass number. Argon (Z=18, A=40) and Calcium (Z=20, A=40) are isobars.',
        points: 2
      },
      {
        id: 'c9-ch4-q13',
        question: 'Which of the following is an incorrect statement in reference with observations in Rutherford\'s α-particle scattering experiment?',
        options: [
          'Some of the α-particles rebound after hitting the gold foil',
          'Some of the particles deflected from their path',
          'Some of the particles not pass through the gold foil',
          'Most of the particles pass straight through the gold foil'
        ],
        correctAnswer: 0,
        explanation: 'Only a minuscule fraction (about 1 out of 12,000 particles) rebounded; saying "some rebound" without context is listed as the incorrect statement.',
        points: 2
      },
      {
        id: 'c9-ch4-q14',
        question: 'Which radioactive isotope is used in the medical treatment of cancer?',
        options: [
          'Iodine-131',
          'Uranium-234',
          'Plutonium-239',
          'Cobalt-60'
        ],
        correctAnswer: 3,
        explanation: 'Cobalt-60 (Co-60) is widely utilized in radiation radiotherapy for cancer treatment.',
        points: 2
      },
      {
        id: 'c9-ch4-q15',
        question: 'Why do most elements try to participate in chemical combinations?\n(i) To gain more electrons\n(ii) To achieve inert gas electronic configuration\n(iii) To complete their octet\n(iv) To complete their inner shells\n\nChoose the correct option among the following:',
        options: [
          'Both (i) & (iii)',
          'Both (ii) & (iii)',
          'Only (ii)',
          'Both (i) & (iv)'
        ],
        correctAnswer: 1,
        explanation: 'Atoms participate in bonding to complete their outermost valence octet (8 electrons) and attain a stable noble/inert gas electronic configuration.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c9-ch4-q16',
        question: 'Assertion (A): Number of electrons is always equal to the proton number in an atom.\nReason (R): Atom is always made up of only proton and electron.',
        options: [
          'Both Assertion and Reason are correct, and reason is the correct explanation for assertion.',
          'Both Assertion and Reason are correct, and Reason is not the correct explanation for Assertion.',
          'Assertion is true but Reason is false.',
          'Both Assertion and Reason are false.'
        ],
        correctAnswer: 2,
        explanation: 'Assertion is true (a neutral atom has equal numbers of protons and electrons). Reason is false because atoms also contain neutrons (except standard hydrogen-1).',
        points: 3
      },
      {
        id: 'c9-ch4-q17',
        question: 'Assertion (A): Number of electrons is always equal to the proton number in an atom.\nReason (R): Atoms are always made up of proton, electron, and neutron.',
        options: [
          'Both Assertion and Reason are correct, and reason is the correct explanation for assertion.',
          'Both Assertion and Reason are correct, and Reason is not the correct explanation for Assertion.',
          'Assertion is true but Reason is false.',
          'Both Assertion and Reason are false.'
        ],
        correctAnswer: 1,
        explanation: 'Both statements are true, but the presence of neutrons does not explain why the number of electrons equals the number of protons (which is due to electrical neutrality).',
        points: 3
      },

      // --- Section 3: Case Study 1 ---
      {
        id: 'c9-ch4-q18',
        question: '[Case Study 1: Early Atomic Models & J.J. Thomson]\nIdentify the correct statement(s):\nStatement 1 - Dalton\'s atomic theory suggested that the atom was indivisible and indestructible.\nStatement 2 - Electrons and protons are present inside the atom.\nStatement 3 - J.J. Thomson was the first one to propose a model for the structure of an atom.\nStatement 4 - Protons are positively charged particles.',
        options: [
          'Only 2',
          'Both 3 & 4',
          'Both 1 & 2',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'All four statements are scientifically and historically accurate according to the NCERT curriculum.',
        points: 2
      },
      {
        id: 'c9-ch4-q19',
        question: '[Case Study 1: Early Atomic Models & J.J. Thomson]\nAccording to Dalton\'s Atomic Theory, matter consists of indivisible ________.',
        options: [
          'Molecules',
          'Atoms',
          'Ions',
          'Mixtures'
        ],
        correctAnswer: 1,
        explanation: 'John Dalton stated that all matter is composed of extremely tiny, indivisible, and indestructible particles called atoms.',
        points: 2
      },
      {
        id: 'c9-ch4-q20',
        question: '[Case Study 1: Early Atomic Models & J.J. Thomson]\nWho was the first scientist to propose a scientific atomic theory?',
        options: [
          'J.J. Thomson',
          'John Dalton',
          'E. Rutherford',
          'Niels Bohr'
        ],
        correctAnswer: 1,
        explanation: 'John Dalton proposed the first atomic theory of matter based on laws of chemical combinations in 1808.',
        points: 2
      },
      {
        id: 'c9-ch4-q21',
        question: '[Case Study 1: Early Atomic Models & J.J. Thomson]\n"Atom is indivisible and indestructible" - why did this postulate of Dalton\'s atomic theory fail?',
        options: [
          'Because atoms can be seen under optical microscopes',
          'Due to the discovery of sub-atomic particles (electrons and protons) inside the atom',
          'Because atoms do not combine in whole number ratios',
          'Because atoms have no mass'
        ],
        correctAnswer: 1,
        explanation: 'The discovery of subatomic particles—electrons by J.J. Thomson and canal rays/protons by E. Goldstein—proved that the atom is divisible.',
        points: 2
      },
      {
        id: 'c9-ch4-q22',
        question: '[Case Study 1: Early Atomic Models & J.J. Thomson]\nIn Thomson\'s watermelon atomic model, what do the watermelon seeds represent?',
        options: [
          'Watermelon seeds represent negatively charged electrons embedded in a positively charged sphere',
          'Watermelon seeds represent positive protons',
          'Watermelon seeds represent neutral neutrons',
          'None of these'
        ],
        correctAnswer: 0,
        explanation: 'Thomson compared electrons to seeds embedded in the red edible sphere of positive charge.',
        points: 2
      },

      // --- Section 4: Case Study 2 ---
      {
        id: 'c9-ch4-q23',
        question: '[Case Study 2: Rutherford\'s Nuclear Model of Atom]\nWhich of the following scientists is known as the \'Father of Nuclear Physics\'?',
        options: [
          'J.J. Thomson',
          'John Dalton',
          'E. Rutherford',
          'Niels Bohr'
        ],
        correctAnswer: 2,
        explanation: 'Ernest Rutherford is universally known as the Father of Nuclear Physics for his discovery of the atomic nucleus and radioactive decay.',
        points: 2
      },
      {
        id: 'c9-ch4-q24',
        question: '[Case Study 2: Rutherford\'s Nuclear Model of Atom]\nThe tiny, dense, positively charged centre in an atom is termed as:',
        options: [
          'Nucleus',
          'Molecule',
          'Atom',
          'Proton'
        ],
        correctAnswer: 0,
        explanation: 'Rutherford termed the small dense central core of an atom the "nucleus".',
        points: 2
      },
      {
        id: 'c9-ch4-q25',
        question: '[Case Study 2: Rutherford\'s Nuclear Model of Atom]\nIdentify the correct statement(s) regarding Rutherford\'s nuclear model:\nStatement 1 - There is a positively charged centre in an atom called the nucleus.\nStatement 2 - The electrons revolve around the nucleus in circular paths.\nStatement 3 - Nearly all the mass of an atom resides in the nucleus.\nStatement 4 - The size of the nucleus is very small as compared to the size of the atom.',
        options: [
          'Only 2',
          'Both 3 & 4',
          'Both 1 & 2',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'All four statements describe the core postulates of Rutherford\'s nuclear atomic model.',
        points: 2
      },
      {
        id: 'c9-ch4-q26',
        question: '[Case Study 2: Rutherford\'s Nuclear Model of Atom]\nWhat was the primary theoretical drawback of Rutherford\'s atomic model?',
        options: [
          'Accelerating revolving electrons in circular orbits would radiate energy and collapse into the nucleus',
          'It could not explain the presence of mass',
          'It claimed that nucleus was negatively charged',
          'It could not explain chemical reactions'
        ],
        correctAnswer: 0,
        explanation: 'According to classical electromagnetic theory, revolving charged particles accelerate and continuously radiate energy, which would make electrons spiral into the nucleus within 10⁻⁸ seconds, rendering atoms unstable.',
        points: 2
      },
      {
        id: 'c9-ch4-q27',
        question: '[Case Study 2: Rutherford\'s Nuclear Model of Atom]\nWhat did Rutherford conclude about the distribution of an atom\'s mass?',
        options: [
          'Mass is distributed uniformly throughout the entire sphere',
          'Nearly all the mass of an atom resides in its tiny positively charged nucleus',
          'Mass is mostly carried by orbital electrons',
          'Atom has negligible mass'
        ],
        correctAnswer: 1,
        explanation: 'Rutherford concluded that virtually all mass and positive charge of an atom is concentrated in a tiny central volume called the nucleus.',
        points: 2
      }
    ]
  },
  {
    id: 'class10-ch1-chemical-reactions-and-equations',
    title: 'Chapter 1: Chemical Reactions and Equations',
    description: 'Comprehensive test covering Types of Chemical Reactions, Balancing Chemical Equations, Corrosion, Rancidity, Assertion-Reason, and Case Study questions.',
    category: 'Class 10',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T16:00:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 10) ---
      {
        id: 'c10-ch1-q1',
        question: 'Which of the following is a displacement reaction?\n(a) MgCO₃ ⟶ MgO + CO₂\n(b) 2Na + 2H₂O ⟶ 2NaOH + H₂\n(c) 2H₂ + O₂ ⟶ 2H₂O\n(d) 2Pb(NO₃)₂ ⟶ 2PbO + 4NO₂ + O₂',
        options: [
          'MgCO₃ ⟶ MgO + CO₂',
          '2Na + 2H₂O ⟶ 2NaOH + H₂',
          '2H₂ + O₂ ⟶ 2H₂O',
          '2Pb(NO₃)₂ ⟶ 2PbO + 4NO₂ + O₂'
        ],
        correctAnswer: 1,
        explanation: 'Sodium (Na) displaces hydrogen from water to form sodium hydroxide (NaOH) and hydrogen gas (H₂). This is a single displacement reaction.',
        points: 2
      },
      {
        id: 'c10-ch1-q2',
        question: 'Magnesium ribbon is rubbed before burning because it has a coating of:',
        options: [
          'basic magnesium carbonate',
          'basic magnesium oxide',
          'basic magnesium sulphide',
          'basic magnesium chloride'
        ],
        correctAnswer: 0,
        explanation: 'Magnesium is a reactive metal. When exposed to moist air, it reacts with atmospheric carbon dioxide and oxygen to form a thin protective layer of basic magnesium carbonate on its surface, which is cleaned off with sandpaper before burning.',
        points: 2
      },
      {
        id: 'c10-ch1-q3',
        question: 'Which of the following statements about the given reaction are correct?\n3Fe (s) + 4H₂O (g) ⟶ Fe₃O₄ (s) + 4H₂ (g)\n(i) Iron metal is getting oxidized\n(ii) Water is getting reduced\n(iii) Water is acting as reducing agent\n(iv) Water is acting as oxidizing agent',
        options: [
          '(i), (ii) and (iii)',
          '(iii) and (iv)',
          '(i), (ii) and (iv)',
          '(ii) and (iv)'
        ],
        correctAnswer: 2,
        explanation: 'Iron gains oxygen to become Fe₃O₄, so it is oxidized. Water loses oxygen to become H₂, so it is reduced. Because water provides oxygen, it acts as the oxidizing agent. Hence statements (i), (ii), and (iv) are correct.',
        points: 2
      },
      {
        id: 'c10-ch1-q4',
        question: 'Which of the following are exothermic processes?\n(i) Reaction of water with quick lime\n(ii) Dilution of an acid\n(iii) Evaporation of water\n(iv) Sublimation of camphor (crystals)',
        options: [
          '(i) and (ii)',
          '(ii) and (iii)',
          '(i) and (iv)',
          '(ii) and (iv)'
        ],
        correctAnswer: 0,
        explanation: 'Reaction of quicklime (CaO) with water produces slaked lime along with large amount of heat. Dilution of concentrated acids with water also liberates heat. Evaporation and sublimation both absorb heat (endothermic).',
        points: 2
      },
      {
        id: 'c10-ch1-q5',
        question: 'Oxidation is a process which involves:',
        options: [
          'addition of oxygen',
          'addition of hydrogen',
          'removal of oxygen',
          'removal of hydrogen'
        ],
        correctAnswer: 0,
        explanation: 'By classical definition, oxidation involves the addition of oxygen (or electronegative element) or removal of hydrogen/electrons from a substance.',
        points: 2
      },
      {
        id: 'c10-ch1-q6',
        question: 'The process of reduction involves:',
        options: [
          'addition of oxygen',
          'addition of hydrogen',
          'removal of oxygen',
          'removal of hydrogen'
        ],
        correctAnswer: 1,
        explanation: 'Reduction is defined as the addition of hydrogen (or electropositive element) or removal of oxygen/gain of electrons by a substance.',
        points: 2
      },
      {
        id: 'c10-ch1-q7',
        question: 'Three beakers labelled as A, B and C each containing 25 ml of water were taken. A small amount of NaOH, anhydrous CuSO₄ and NaCl were added to the beakers A, B and C respectively. It was observed that there was an increase in the temperature of the solution contained in beakers A and B, whereas in case of beaker C, the temperature of the solution falls. Which one of the following statement(s) is (are) correct?\n(i) In beakers A and B, exothermic process has occurred.\n(ii) In beakers A and B, endothermic process has occurred.\n(iii) In beaker C exothermic process has occurred.\n(iv) In beaker C endothermic process has occurred.',
        options: [
          '(i) only',
          '(ii) only',
          '(i) and (iv)',
          '(iv), (ii) and (iii)'
        ],
        correctAnswer: 2,
        explanation: 'A rise in temperature indicates that heat is released to the surroundings (exothermic process in beakers A and B). A fall in temperature indicates heat is absorbed from the surroundings (endothermic process in beaker C).',
        points: 2
      },
      {
        id: 'c10-ch1-q8',
        question: 'Give the ratio in which hydrogen and oxygen are present in water by volume:',
        options: [
          '1 : 2',
          '1 : 1',
          '2 : 1',
          '1 : 8'
        ],
        correctAnswer: 2,
        explanation: 'Water has the chemical formula H₂O. When water undergoes electrolysis, 2 volumes of hydrogen gas and 1 volume of oxygen gas are produced, giving a volume ratio of 2:1 (Hydrogen : Oxygen). By mass, the ratio is 1:8.',
        points: 2
      },
      {
        id: 'c10-ch1-q9',
        question: 'Which among the following statement(s) is (are) true?\nExposure of silver chloride to sunlight for a long duration turns grey due to:\n(i) the formation of silver by decomposition of silver chloride\n(ii) sublimation of silver chloride\n(iii) decomposition of chlorine gas from silver chloride\n(iv) oxidation of silver chloride',
        options: [
          '(i) only',
          '(i) and (iii)',
          '(ii) and (iii)',
          '(iv) only'
        ],
        correctAnswer: 0,
        explanation: 'In the presence of sunlight, white silver chloride undergoes photochemical decomposition to form grey metallic silver and chlorine gas: 2AgCl (s) ⟶ 2Ag (s) + Cl₂ (g).',
        points: 2
      },
      {
        id: 'c10-ch1-q10',
        question: 'MnO₂ + 4HCl ⟶ MnCl₂ + 2H₂O + Cl₂\nIdentify the substance oxidized in the above equation:',
        options: [
          'MnCl₂',
          'HCl',
          'H₂O',
          'MnO₂'
        ],
        correctAnswer: 1,
        explanation: 'In this redox reaction, HCl loses hydrogen to form Cl₂, meaning HCl is oxidized. MnO₂ loses oxygen to form MnCl₂, meaning MnO₂ is reduced.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c10-ch1-q11',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): Silver articles become black after sometime when exposed to sunlight/air.\nReason (R): It is because silver reacts with carbonates present in the air.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 2,
        explanation: 'Assertion is true (silver tarnishes and turns black in air). Reason is false because silver reacts with traces of hydrogen sulphide (H₂S) gas present in air to form a black coating of silver sulphide (Ag₂S), not carbonates.',
        points: 3
      },
      {
        id: 'c10-ch1-q12',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): Lead nitrate on thermal decomposition gives lead oxide, brown coloured nitrogen dioxide and oxygen gas.\nReason (R): Lead nitrate reacts with potassium iodide to form yellow ppt. of lead iodide and the reaction is double displacement as well as precipitation reaction.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 1,
        explanation: 'Both statements are true facts: 2Pb(NO₃)₂ ⟶ 2PbO + 4NO₂ + O₂ (thermal decomposition), and Pb(NO₃)₂ + 2KI ⟶ PbI₂↓ + 2KNO₃ (precipitation reaction). However, the precipitation reaction with KI does not explain thermal decomposition.',
        points: 3
      },

      // --- Section 3: Case Study 1 (Corrosion & Rancidity) ---
      {
        id: 'c10-ch1-q13',
        question: '[Case Study 1: Corrosion & Rancidity]\nOxidation has damaging effect on metals as well as on food. The phenomenon due to which metals are slowly eaten away by air, water and chemicals is called corrosion. Rancidity is the process of slow oxidation of oil and fat present in food materials resulting in changes of smell and taste.\n\nRancidity can be prevented by:',
        options: [
          'Adding antioxidants',
          'Packaging oily food in nitrogen gas',
          'Both (a) and (b)',
          'None of these'
        ],
        correctAnswer: 2,
        explanation: 'Rancidity can be prevented by adding antioxidants (which retard oxidation) and by flushing chips packets with inert unreactive nitrogen gas to prevent contact with oxygen.',
        points: 2
      },
      {
        id: 'c10-ch1-q14',
        question: '[Case Study 1: Corrosion & Rancidity]\nCombination of phosphorus and oxygen (4P + 3O₂ ⟶ 2P₂O₃ or 4P + 5O₂ ⟶ 2P₂O₅) is an example of:',
        options: [
          'Oxidation',
          'Reduction',
          'Rancidity',
          'None of these'
        ],
        correctAnswer: 0,
        explanation: 'Phosphorus combines with oxygen to form phosphorus oxides. Addition of oxygen to any substance is an oxidation reaction.',
        points: 2
      },
      {
        id: 'c10-ch1-q15',
        question: '[Case Study 1: Corrosion & Rancidity]\nA science teacher wrote the following statements about rancidity:\nI. When fats and oils are reduced, they become rancid.\nII. In chips packet, rancidity is prevented by oxygen.\nIII. Rancidity is prevented by adding antioxidants.\nSelect the correct option:',
        options: [
          '(I) only',
          '(I) and (II) only',
          '(III) only',
          '(I), (II) and (III)'
        ],
        correctAnswer: 2,
        explanation: 'Fats and oils become rancid upon oxidation (not reduction). In packets, rancidity is prevented by inert nitrogen gas (not oxygen). Statement III is the only accurate statement.',
        points: 2
      },
      {
        id: 'c10-ch1-q16',
        question: '[Case Study 1: Corrosion & Rancidity]\nTwo statements are given below regarding rusting of iron:\nI. The rusting of iron is a redox reaction and reaction occurs as, 4Fe + 3O₂ ⟶ 4Fe³⁺ + 6O²⁻.\nII. The metallic iron is oxidised to Fe³⁺ and O₂ is reduced to O²⁻.\nSelect the correct statement(s):',
        options: [
          'I only',
          'II only',
          'Both I and II',
          'None of these'
        ],
        correctAnswer: 2,
        explanation: 'In rusting, iron atoms lose electrons to form Fe³⁺ ions (oxidation), while oxygen molecules gain electrons to form oxide ions O²⁻ (reduction). Both statements I and II are correct.',
        points: 3
      },
      {
        id: 'c10-ch1-q17',
        question: '[Case Study 1: Corrosion & Rancidity]\nWhich of the following measures can be adopted to prevent or slow down rancidity?\nI. Food materials should be packed in airtight container.\nII. Food should be refrigerated.\nIII. Food materials and cooked food should be kept away from direct sunlight.',
        options: [
          'Only II and III',
          'Only I and II',
          'Only I and III',
          'I, II and III'
        ],
        correctAnswer: 3,
        explanation: 'Airtight packaging limits oxygen supply, refrigeration lowers temperature which slows oxidation reaction rates, and storing away from sunlight prevents photochemical oxidation. All three are valid preventive measures.',
        points: 3
      },

      // --- Section 4: Case Study 2 (Chemical Equations & Balancing) ---
      {
        id: 'c10-ch1-q18',
        question: '[Case Study 2: Chemical Equations & Balancing]\nConsider the following reaction:\np Mg₃N₂ + q H₂O ⟶ r Mg(OH)₂ + s NH₃\nWhen the equation is balanced, the stoichiometric coefficients p, q, r, s respectively are:',
        options: [
          '1, 3, 3, 2',
          '1, 6, 3, 2',
          '1, 2, 3, 2',
          '2, 3, 6, 2'
        ],
        correctAnswer: 1,
        explanation: 'For 1 mole of Mg₃N₂ (p=1): there are 3 Mg atoms, so r=3. There are 2 N atoms, so s=2. On the product side, total H = (3 × 2) + (2 × 3) = 12, so q = 6. Total O = 3 × 2 = 6, which matches 6 H₂O. Hence p=1, q=6, r=3, s=2.',
        points: 2
      },
      {
        id: 'c10-ch1-q19',
        question: '[Case Study 2: Chemical Equations & Balancing]\nWhich of the following information is NOT conveyed by a balanced chemical equation?',
        options: [
          'Physical states of reactants and products',
          'Symbols and formulae of all substances involved in the reaction',
          'Number of atoms/molecules of the reactants and products formed',
          'Whether a particular reaction is actually feasible or not'
        ],
        correctAnswer: 3,
        explanation: 'A balanced chemical equation represents the stoichiometry, formulae, and physical states of reactants and products, but does not provide information about whether the reaction will spontaneously take place or is feasible under standard conditions.',
        points: 2
      },
      {
        id: 'c10-ch1-q20',
        question: '[Case Study 2: Chemical Equations & Balancing]\nThe balancing of chemical equations is strictly in accordance with:',
        options: [
          'law of combining volumes',
          'law of constant proportions',
          'law of conservation of mass',
          'both (b) and (c)'
        ],
        correctAnswer: 2,
        explanation: 'The Law of Conservation of Mass dictates that mass can neither be created nor destroyed in a chemical reaction. Therefore, the total number of atoms of each element must remain equal on both sides of the equation.',
        points: 2
      },
      {
        id: 'c10-ch1-q21',
        question: '[Case Study 2: Chemical Equations & Balancing]\nWhich of the following chemical equations is an unbalanced one?',
        options: [
          '2NaHCO₃ ⟶ Na₂CO₃ + H₂O + CO₂',
          '2C₄H₁₀ + 12O₂ ⟶ 8CO₂ + 10H₂O',
          '2Al + 6H₂O ⟶ 2Al(OH)₃ + 3H₂',
          '4NH₃ + 5O₂ ⟶ 4NO + 6H₂O'
        ],
        correctAnswer: 1,
        explanation: 'In equation (b), Reactant side has 12 × 2 = 24 Oxygen atoms, while Product side has (8 × 2) + 10 = 26 Oxygen atoms. Thus, it is unbalanced. The correctly balanced equation requires 13O₂.',
        points: 3
      },
      {
        id: 'c10-ch1-q22',
        question: '[Case Study 2: Chemical Equations & Balancing]\nWhich of the following statements is/are correct regarding a chemical equation?',
        options: [
          'A chemical equation tells us about the substances involved in a reaction',
          'A chemical equation informs us about the symbols and formulae of the substances involved',
          'A chemical equation tells us about the ratio of atoms or molecules of reactants and products',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'A balanced chemical equation provides complete information about the reactants and products, their chemical formulas, and their relative molar/molecular quantities.',
        points: 3
      }
    ]
  },
  {
    id: 'class10-ch2-acids-bases-and-salts',
    title: 'Chapter 2: Acids, Bases and Salts',
    description: 'Comprehensive test covering Properties of Acids and Bases, pH scale, Indicators, Salts (Baking Soda, Washing Soda, Bleaching Powder, Plaster of Paris), Assertion-Reason, and Case Study questions.',
    category: 'Class 10',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T16:15:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 10) ---
      {
        id: 'c10-ch2-q1',
        question: 'What happens when a solution of an acid is mixed with a solution of a base in a test tube?\n(i) Temperature of the solution decreases\n(ii) Temperature of the solution increases\n(iii) Temperature of the solution remains the same\n(iv) Salt formation takes place',
        options: [
          '(i) and (iv)',
          '(i) and (iii)',
          '(ii) only',
          '(ii) and (iv)'
        ],
        correctAnswer: 3,
        explanation: 'The reaction between an acid and a base is called a neutralization reaction. It is an exothermic reaction (heat is released, so temperature increases) and results in the formation of salt and water.',
        points: 2
      },
      {
        id: 'c10-ch2-q2',
        question: 'When hydrogen chloride gas is prepared on a humid day, the gas is usually passed through the guard tube containing calcium chloride. The role of calcium chloride taken in the guard tube is to:',
        options: [
          'absorb the evolved gas',
          'moisten the gas',
          'absorb moisture from the gas',
          'absorb Cl⁻ ions from the evolved gas'
        ],
        correctAnswer: 2,
        explanation: 'Anhydrous calcium chloride (CaCl₂) is a strong desiccating/hygroscopic agent. It absorbs moisture from the evolved moist HCl gas, making the gas dry.',
        points: 2
      },
      {
        id: 'c10-ch2-q3',
        question: 'Which one of the following salts does NOT contain water of crystallisation?',
        options: [
          'Blue vitriol',
          'Baking soda',
          'Washing soda',
          'Gypsum'
        ],
        correctAnswer: 1,
        explanation: 'Blue vitriol is CuSO₄·5H₂O, Washing soda is Na₂CO₃·10H₂O, Gypsum is CaSO₄·2H₂O. Baking soda is sodium hydrogen carbonate (NaHCO₃), which does not contain water of crystallisation.',
        points: 2
      },
      {
        id: 'c10-ch2-q4',
        question: 'In terms of acidic strength, which one of the following is in the correct increasing order?',
        options: [
          'Water < Acetic acid < Hydrochloric acid',
          'Water < Hydrochloric acid < Acetic acid',
          'Acetic acid < Water < Hydrochloric acid',
          'Hydrochloric acid < Water < Acetic acid'
        ],
        correctAnswer: 0,
        explanation: 'Pure water is neutral (pH = 7). Acetic acid (CH₃COOH) is a weak organic acid that partially dissociates in water. Hydrochloric acid (HCl) is a strong mineral acid that ionizes completely. Hence, the correct increasing order is: Water < Acetic acid < Hydrochloric acid.',
        points: 2
      },
      {
        id: 'c10-ch2-q5',
        question: 'What is formed when zinc reacts with sodium hydroxide?',
        options: [
          'Zinc hydroxide and sodium',
          'Sodium zincate and hydrogen gas',
          'Sodium zinc-oxide and hydrogen gas',
          'Sodium zincate and water'
        ],
        correctAnswer: 1,
        explanation: 'Amphoteric zinc reacts with strong base sodium hydroxide upon heating to form soluble sodium zincate and hydrogen gas: Zn + 2NaOH ⟶ Na₂ZnO₂ + H₂↑.',
        points: 2
      },
      {
        id: 'c10-ch2-q6',
        question: 'Tomato is a natural source of which acid?',
        options: [
          'Acetic acid',
          'Citric acid',
          'Tartaric acid',
          'Oxalic acid'
        ],
        correctAnswer: 3,
        explanation: 'Tomatoes are a rich natural source of oxalic acid ((COOH)₂). Vinegar contains acetic acid, tamarind contains tartaric acid, and citrus fruits contain citric acid.',
        points: 2
      },
      {
        id: 'c10-ch2-q7',
        question: 'Brine is an:',
        options: [
          'aqueous solution of sodium hydroxide',
          'aqueous solution of sodium carbonate',
          'aqueous solution of sodium chloride',
          'aqueous solution of sodium bicarbonate'
        ],
        correctAnswer: 2,
        explanation: 'A concentrated aqueous solution of sodium chloride (NaCl in water) is known as brine. It is used in the chlor-alkali process to manufacture NaOH, Cl₂, and H₂.',
        points: 2
      },
      {
        id: 'c10-ch2-q8',
        question: 'Na₂CO₃ · 10H₂O is:',
        options: [
          'washing soda',
          'baking soda',
          'bleaching powder',
          'tartaric acid'
        ],
        correctAnswer: 0,
        explanation: 'Sodium carbonate decahydrate (Na₂CO₃·10H₂O) is commonly called washing soda. It is prepared by recrystallization of sodium carbonate.',
        points: 2
      },
      {
        id: 'c10-ch2-q9',
        question: 'At what temperature is gypsum heated to form Plaster of Paris?',
        options: [
          '90°C',
          '100°C',
          '110°C',
          '120°C'
        ],
        correctAnswer: 1,
        explanation: 'When gypsum (CaSO₄·2H₂O) is heated at 373 K (100°C), it loses three-fourths of its water of crystallisation to form Plaster of Paris (calcium sulphate hemihydrate, CaSO₄·½H₂O). Above this temperature, dead burnt plaster is formed.',
        points: 2
      },
      {
        id: 'c10-ch2-q10',
        question: 'How many water molecules does hydrated calcium sulphate contain?',
        options: [
          '5',
          '10',
          '7',
          '2'
        ],
        correctAnswer: 3,
        explanation: 'Hydrated calcium sulphate is gypsum, with formula CaSO₄·2H₂O. It contains 2 molecules of water of crystallisation attached to each formula unit of CaSO₄.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c10-ch2-q11',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): The process of dissolving an acid or a base in water is highly exothermic reaction.\nReason (R): Water must always be added slowly to acid with constant stirring.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 2,
        explanation: 'Assertion is true (dissolution of concentrated acid or base in water is intensely exothermic). Reason is false because acid must always be added slowly to water with constant stirring, never water to acid (which could cause local overheating, violent boiling and dangerous acid splashing).',
        points: 3
      },
      {
        id: 'c10-ch2-q12',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): Higher the H⁺ ion concentration, lower is the pH value.\nReason (R): The pH of a neutral solution = 7, that of a basic solution < 7 and that of an acidic solution > 7.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 2,
        explanation: 'Assertion is true because pH is defined as -log[H⁺], so an increase in H⁺ ion concentration decreases pH. Reason is false because acidic solutions have pH < 7, neutral solutions have pH = 7, and basic solutions have pH > 7.',
        points: 3
      },

      // --- Section 3: Case Study 1 (Bleaching Powder) ---
      {
        id: 'c10-ch2-q13',
        question: '[Case Study 1: Bleaching Powder]\nBleaching powder is also known as chloride of lime. It is a solid and yellowish white in colour with a strong smell of chlorine. When slaked lime reacts with chlorine, it gives calcium oxychloride (bleaching powder) and water. Dilute acids liberate nascent oxygen from bleaching powder, which acts as a bleaching agent.\n\nBleaching powder is used as:',
        options: [
          'Bleaching agent in textile, paper and jute industry',
          'Disinfectant for water to make water free of germs',
          'Oxidising agent in many industries',
          'All of these'
        ],
        correctAnswer: 3,
        explanation: 'Bleaching powder (CaOCl₂) is used to bleach cotton and linen in textile industry, wood pulp in paper factories, as a chemical disinfectant to make drinking water germ-free, and as an oxidising agent in chemical synthesis.',
        points: 2
      },
      {
        id: 'c10-ch2-q14',
        question: '[Case Study 1: Bleaching Powder]\nBleaching powder is also known as:',
        options: [
          'Calcium oxychloride',
          'Calcium hypochlorite',
          'Chloride of lime',
          'All of these'
        ],
        correctAnswer: 3,
        explanation: 'Chemically, bleaching powder is calcium oxychloride (or calcium hypochlorite chloride, CaOCl₂), and commercially it is also referred to as chloride of lime.',
        points: 2
      },
      {
        id: 'c10-ch2-q15',
        question: '[Case Study 1: Bleaching Powder]\nBleaching powder gives the smell of chlorine because it:',
        options: [
          'Is unstable',
          'Gives chlorine on exposure to atmosphere',
          'Is a mixture of chlorine and slaked lime',
          'Contains excess of chlorine'
        ],
        correctAnswer: 1,
        explanation: 'When exposed to air, bleaching powder reacts slowly with atmospheric carbon dioxide to liberate chlorine gas: CaOCl₂ + CO₂ ⟶ CaCO₃ + Cl₂↑, giving its characteristic pungent smell.',
        points: 2
      },
      {
        id: 'c10-ch2-q16',
        question: '[Case Study 1: Bleaching Powder]\nSelect the correct statement(s) regarding bleaching powder:\n(a) It is pale yellow powder having smell of chlorine.\n(b) It is sparingly soluble in water and gives milky suspension when dissolved in water.\n(c) As bleaching powder gives nascent oxygen, it shows bleaching property.\n(d) All of these.',
        options: [
          'It is pale yellow powder having smell of chlorine',
          'It is sparingly soluble in water and gives milky suspension when dissolved in water',
          'As bleaching powder gives nascent oxygen, it shows bleaching property',
          'All of these'
        ],
        correctAnswer: 3,
        explanation: 'All statements are correct characteristics of bleaching powder: yellowish-white appearance, chlorine smell, milky suspension due to unreacted slaked lime, and bleaching action via nascent oxygen release.',
        points: 3
      },
      {
        id: 'c10-ch2-q17',
        question: '[Case Study 1: Bleaching Powder]\nIdentify the product \'X\' in the given reaction:\nCa(OH)₂ + Cl₂ ⟶ X + H₂O',
        options: [
          'CaOCl₂',
          'CaCl₂',
          'Ca(ClO₃)₂',
          'CaCO₃'
        ],
        correctAnswer: 0,
        explanation: 'Passing dry chlorine gas over dry slaked lime Ca(OH)₂ produces calcium oxychloride (bleaching powder, CaOCl₂) and water.',
        points: 3
      },

      // --- Section 4: Case Study 2 (Baking Soda & Baking Powder) ---
      {
        id: 'c10-ch2-q18',
        question: '[Case Study 2: Baking Soda & Baking Powder]\nBaking powder produces CO₂ on heating to make batter spongy. Baking powder is a mixture of baking soda (NaHCO₃) and a mild edible acid like tartaric acid. Tartaric acid neutralizes the sodium carbonate formed, removing the bitter taste.\n\nOn passing excess CO₂ gas in an aqueous solution of sodium carbonate, the substance obtained is:',
        options: [
          'NaOH',
          'NaHCO₃',
          'Na₂CO₃·10H₂O',
          'Na₂CO₃·H₂O'
        ],
        correctAnswer: 1,
        explanation: 'Passing excess carbon dioxide gas through an aqueous solution of sodium carbonate results in the formation of sodium hydrogen carbonate (baking soda): Na₂CO₃ + H₂O + CO₂ ⟶ 2NaHCO₃.',
        points: 2
      },
      {
        id: 'c10-ch2-q19',
        question: '[Case Study 2: Baking Soda & Baking Powder]\nWhen sodium hydrogen carbonate is added to acetic acid, it evolves a gas. Which of the following statements are true about the gas evolved?\nI. It turns lime water milky.\nII. It extinguishes a burning splinter.\nIII. It dissolves in sodium hydroxide solution.\nIV. It has a pungent odour.',
        options: [
          '(I) and (II)',
          '(I), (II) and (III)',
          '(II), (III) and (IV)',
          '(I) and (IV)'
        ],
        correctAnswer: 1,
        explanation: 'The gas evolved is carbon dioxide (CO₂). CO₂ turns lime water milky, extinguishes a flame/splinter, and dissolves in NaOH to produce Na₂CO₃. CO₂ is an odourless gas (not pungent). Thus, statements I, II, and III are true.',
        points: 2
      },
      {
        id: 'c10-ch2-q20',
        question: '[Case Study 2: Baking Soda & Baking Powder]\nSelect the correct statement regarding sodium hydrogen carbonate (NaHCO₃):',
        options: [
          'CO and CO₂ are produced during the heating of NaHCO₃',
          'It is insoluble in water',
          'It is used in soda-acid fire extinguishers',
          'All of these'
        ],
        correctAnswer: 2,
        explanation: 'Sodium hydrogen carbonate (NaHCO₃) is used in soda-acid fire extinguishers because on reacting with acid it rapidly liberates non-flammable CO₂ gas that smothers fires.',
        points: 2
      },
      {
        id: 'c10-ch2-q21',
        question: '[Case Study 2: Baking Soda & Baking Powder]\nAcetic acid was added to a solid X kept in a test tube. A colourless and odourless gas was evolved. The gas was passed through lime water which turned milky. It was concluded that:',
        options: [
          'Solid X is sodium hydroxide and the gas evolved is CO₂',
          'Solid X is sodium bicarbonate and the gas evolved is CO₂',
          'Solid X is sodium acetate and the gas evolved is CO₂',
          'Solid X is sodium chloride and the gas evolved is CO₂'
        ],
        correctAnswer: 1,
        explanation: 'Reaction of sodium bicarbonate (NaHCO₃) with acetic acid (CH₃COOH) yields sodium acetate, water, and effervescence of CO₂ gas: NaHCO₃ + CH₃COOH ⟶ CH₃COONa + H₂O + CO₂↑. The CO₂ turns lime water milky.',
        points: 3
      },
      {
        id: 'c10-ch2-q22',
        question: '[Case Study 2: Baking Soda & Baking Powder]\nWhich of the following statements are correct regarding baking soda?\nI. Baking soda is sodium hydrogen carbonate.\nII. On heating, baking soda gives sodium carbonate.\nIII. It is used for manufacture of soap.\nIV. It is an ingredient of baking powder.',
        options: [
          'I and IV only',
          'I, II and III only',
          'I, II and IV only',
          'I, II, III and IV'
        ],
        correctAnswer: 2,
        explanation: 'Statements I, II, and IV are correct. Statement III is false because sodium hydroxide (caustic soda, NaOH) is used in soap manufacturing (saponification), not sodium hydrogen carbonate (baking soda).',
        points: 3
      }
    ]
  },
  {
    id: 'class10-ch3-metals-and-non-metals',
    title: 'Chapter 3: Metals and Non-metals',
    description: 'Comprehensive test covering Physical and Chemical Properties of Metals and Non-metals, Reactivity Series, Ionic Compounds, Metallurgy, Corrosion, Assertion-Reason, and Case Study questions.',
    category: 'Class 10',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T16:30:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 10) ---
      {
        id: 'c10-ch3-q1',
        question: 'Aluminium is used for making cooking utensils. Which of the following properties of aluminium are responsible for the same?\n(i) Good thermal conductivity\n(ii) Good electrical conductivity\n(iii) Ductility\n(iv) High melting point',
        options: [
          '(i) and (ii)',
          '(i) and (iii)',
          '(ii) and (iii)',
          '(i) and (iv)'
        ],
        correctAnswer: 3,
        explanation: 'For cooking utensils, aluminium needs excellent thermal conductivity to distribute heat quickly to food, and a high melting point so it does not deform or melt during prolonged heating.',
        points: 2
      },
      {
        id: 'c10-ch3-q2',
        question: 'The most abundant metal in the earth\'s crust is:',
        options: [
          'Iron',
          'Aluminium',
          'Calcium',
          'Sodium'
        ],
        correctAnswer: 1,
        explanation: 'Aluminium is the most abundant metal in the Earth\'s crust, comprising about 8.1% of its total mass. Oxygen is the most abundant element, and silicon is the most abundant non-metal/metalloid.',
        points: 2
      },
      {
        id: 'c10-ch3-q3',
        question: 'The poorest conductor of heat among metals is:',
        options: [
          'Lead',
          'Mercury',
          'Calcium',
          'Sodium'
        ],
        correctAnswer: 0,
        explanation: 'Lead (Pb) is the poorest conductor of heat among metals, followed by mercury (Hg). Silver and copper are the best conductors.',
        points: 2
      },
      {
        id: 'c10-ch3-q4',
        question: 'Which property of metals is used for making bells and strings of musical instruments like Sitar and Violin?',
        options: [
          'Sonorousness',
          'Malleability',
          'Ductility',
          'Conductivity'
        ],
        correctAnswer: 0,
        explanation: 'Sonorousness is the property of metals that produce a resonant ringing sound when struck by another hard object. This property makes them ideal for bells and instrument strings.',
        points: 2
      },
      {
        id: 'c10-ch3-q5',
        question: 'Al₂O₃ + 2NaOH ⟶ ______ + H₂O',
        options: [
          'Al(OH)₃',
          'Na₂O',
          'NaAlO₂',
          'AlNaO₂'
        ],
        correctAnswer: 2,
        explanation: 'Aluminium oxide (Al₂O₃) is an amphoteric oxide. It reacts with strong base sodium hydroxide to form sodium aluminate (NaAlO₂) and water: Al₂O₃ + 2NaOH ⟶ 2NaAlO₂ + H₂O.',
        points: 2
      },
      {
        id: 'c10-ch3-q6',
        question: 'Which of the following is the correct arrangement of the given metals in order of their reactivity (highest to lowest)?\nZinc, Iron, Magnesium, Sodium',
        options: [
          'Zinc > Iron > Magnesium > Sodium',
          'Sodium > Magnesium > Iron > Zinc',
          'Sodium > Zinc > Magnesium > Iron',
          'Sodium > Magnesium > Zinc > Iron'
        ],
        correctAnswer: 3,
        explanation: 'According to the reactivity series of metals, the reactivity order is: Sodium (Na) > Magnesium (Mg) > Zinc (Zn) > Iron (Fe).',
        points: 2
      },
      {
        id: 'c10-ch3-q7',
        question: 'Which of the following pairs will give displacement reactions?',
        options: [
          'FeSO₄ solution and Copper metal',
          'AgNO₃ solution and Copper metal',
          'CuSO₄ solution and Silver metal',
          'NaCl solution and Copper metal'
        ],
        correctAnswer: 1,
        explanation: 'Copper is more reactive than silver (Cu > Ag). Hence, copper displaces silver from silver nitrate solution: Cu + 2AgNO₃ ⟶ Cu(NO₃)₂ + 2Ag↓.',
        points: 2
      },
      {
        id: 'c10-ch3-q8',
        question: 'Non-metals form covalent chlorides because:',
        options: [
          'they can give electrons to chlorine',
          'they can share electrons with chlorine',
          'they can give electrons to chlorine atoms to form chloride ions',
          'they cannot share electrons with chlorine atoms'
        ],
        correctAnswer: 1,
        explanation: 'Non-metals have high electronegativity and cannot easily give away electrons to chlorine atoms. Instead, they share electrons with chlorine atoms to form covalent bonds (e.g., PCl₃, CCl₄, HCl).',
        points: 2
      },
      {
        id: 'c10-ch3-q9',
        question: 'Which of the following oxide(s) of iron would be obtained on prolonged reaction of iron with steam?',
        options: [
          'FeO',
          'Fe₂O₃',
          'Fe₃O₄',
          'Fe₂O₃ and Fe₃O₄'
        ],
        correctAnswer: 2,
        explanation: 'Red hot iron reacts with steam to form mixed iron oxide (ferrosoferric oxide, Fe₃O₄) and hydrogen gas: 3Fe (s) + 4H₂O (g) ⟶ Fe₃O₄ (s) + 4H₂ (g).',
        points: 2
      },
      {
        id: 'c10-ch3-q10',
        question: 'Which of the following are NOT ionic compounds?\n(i) KCl\n(ii) HCl\n(iii) CCl₄\n(iv) NaCl',
        options: [
          '(i) and (ii)',
          '(ii) and (iii)',
          '(iii) and (iv)',
          '(i) and (iii)'
        ],
        correctAnswer: 1,
        explanation: 'KCl and NaCl are ionic compounds formed by complete transfer of electrons between metal and non-metal. HCl and CCl₄ are covalent compounds formed by sharing of electron pairs.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c10-ch3-q11',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): Aluminium oxide and zinc oxide are acidic in nature.\nReason (R): Amphoteric nature means that substances have both acidic and basic character.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 3,
        explanation: 'Assertion is false because aluminium oxide (Al₂O₃) and zinc oxide (ZnO) are amphoteric oxides (not purely acidic oxides). Reason is true because amphoteric oxides react with both acids and bases to produce salt and water.',
        points: 3
      },
      {
        id: 'c10-ch3-q12',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): C and N do not react with dil. HCl and dil. H₂SO₄.\nReason (R): Metals do not react with dil. HCl and dil. H₂SO₄.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 2,
        explanation: 'Assertion is true because non-metals like carbon and nitrogen are electron acceptors and cannot reduce H⁺ ions to H₂ gas. Reason is false because active metals (like Mg, Zn, Fe) react readily with dilute HCl and H₂SO₄ to evolve hydrogen gas.',
        points: 3
      },

      // --- Section 3: Case Study 1 (Properties and Classes of Metals) ---
      {
        id: 'c10-ch3-q13',
        question: '[Case Study 1: Properties of Metals]\nMetals lose electrons to form positive ions (cations) and are electropositive in nature. Metals of vital importance to national defense, aerospace, energy and industry are called strategic metals.\n\nWhich of the following is a strategic metal?',
        options: [
          'Titanium',
          'Zirconium',
          'Manganese',
          'All of these'
        ],
        correctAnswer: 3,
        explanation: 'Titanium, zirconium, and manganese are called strategic metals because they are light, strong, highly resistant to corrosion, and indispensable for atomic energy, aerospace, jet engines, and defense equipment.',
        points: 2
      },
      {
        id: 'c10-ch3-q14',
        question: '[Case Study 1: Properties of Metals]\nWhich metal is the best conductor of electricity?',
        options: [
          'Silver',
          'Platinum',
          'Nickel',
          'Iron'
        ],
        correctAnswer: 0,
        explanation: 'Silver (Ag) has the highest electrical conductivity of all metals at room temperature, followed by copper (Cu).',
        points: 2
      },
      {
        id: 'c10-ch3-q15',
        question: '[Case Study 1: Properties of Metals]\nWhich of the following metals is NOT a coinage metal?',
        options: [
          'Copper',
          'Silver',
          'Iron',
          'Gold'
        ],
        correctAnswer: 2,
        explanation: 'Copper (Cu), Silver (Ag), and Gold (Au) are group 11 elements historically known as coinage metals because they were used for minting coins. Iron is an industrial metal, not a coinage metal.',
        points: 2
      },
      {
        id: 'c10-ch3-q16',
        question: '[Case Study 1: Properties of Metals]\nWhich of the following are the most malleable metals?\nI. Sodium\nII. Gold\nIII. Potassium\nIV. Silver',
        options: [
          '(I) and (IV)',
          '(II) and (III)',
          '(III) and (IV)',
          '(II) and (IV)'
        ],
        correctAnswer: 3,
        explanation: 'Gold (Au) and Silver (Ag) are the most malleable metals. They can be hammered into sheets of thickness less than 0.0001 mm. Sodium and potassium are soft and ductile rather than malleable.',
        points: 3
      },
      {
        id: 'c10-ch3-q17',
        question: '[Case Study 1: Properties of Metals]\nIdentify the correct statement(s):\nI. The wires that carry current in our homes have a coating of PVC or a rubber like material.\nII. School bells are made of metals.\nIII. Metals do not conduct electricity.\nIV. Metals which produce a sound on striking a hard surface are said to be non-sonorous.',
        options: [
          '(I) and (III)',
          '(I) and (II)',
          '(III) and (IV)',
          'Only (II)'
        ],
        correctAnswer: 1,
        explanation: 'Domestic wires are insulated with PVC to prevent electrical shocks (I is true). Metals are sonorous, so school bells are made of metal (II is true). Statements III and IV are contradictory to the fundamental properties of metals.',
        points: 3
      },

      // --- Section 4: Case Study 2 (Ionic Compounds & Bonding) ---
      {
        id: 'c10-ch3-q18',
        question: '[Case Study 2: Ionic Compounds & Bonding]\nAn ionic bond is formed by electrostatic attraction between oppositely charged ions. Metals lose valence electrons to form cations, while non-metals accept electrons to form anions.\n\nWhich of the following can change to a cation?',
        options: [
          'Fluorine',
          'Oxygen',
          'Potassium',
          'Neon'
        ],
        correctAnswer: 2,
        explanation: 'Potassium (K) is an alkali metal with electronic configuration (2, 8, 8, 1). It readily loses 1 electron to attain stable octet configuration as K⁺ cation.',
        points: 2
      },
      {
        id: 'c10-ch3-q19',
        question: '[Case Study 2: Ionic Compounds & Bonding]\nWhich of the following can change to an anion?',
        options: [
          'Iodine',
          'Magnesium',
          'Calcium',
          'Xenon'
        ],
        correctAnswer: 0,
        explanation: 'Iodine (I) is a halogen non-metal with 7 valence electrons. It readily accepts 1 electron to form the stable iodide anion (I⁻).',
        points: 2
      },
      {
        id: 'c10-ch3-q20',
        question: '[Case Study 2: Ionic Compounds & Bonding]\nIonic compounds are generally soluble in:',
        options: [
          'Kerosene',
          'Petrol',
          'Water',
          'None of these'
        ],
        correctAnswer: 2,
        explanation: 'Ionic compounds are polar and dissolve in polar solvents like water due to high hydration energy, which overcomes the electrostatic lattice energy. They are insoluble in non-polar solvents like kerosene or petrol.',
        points: 2
      },
      {
        id: 'c10-ch3-q21',
        question: '[Case Study 2: Ionic Compounds & Bonding]\nWhich of the following statements is correct about ionic compounds?\nI. They conduct electricity in solid state.\nII. They conduct electricity in solutions.\nIII. They conduct electricity in molten state.',
        options: [
          'I only',
          'II only',
          'III only',
          'II and III only'
        ],
        correctAnswer: 3,
        explanation: 'In the solid state, ions cannot move due to rigid crystal structure. In molten state or aqueous solution, the electrostatic forces are weakened, freeing the ions to migrate and conduct electricity. Hence statements II and III are correct.',
        points: 3
      },
      {
        id: 'c10-ch3-q22',
        question: '[Case Study 2: Ionic Compounds & Bonding]\nSelect the incorrect statement:',
        options: [
          'Ionic compounds are generally brittle',
          'Ions are the fundamental units of ionic compounds',
          'Formation of ionic bonds involve sharing of electrons',
          'NaCl is an ionic compound'
        ],
        correctAnswer: 2,
        explanation: 'Ionic bonds are formed by the complete transfer of electrons from electropositive metal to electronegative non-metal. Sharing of electrons results in covalent bonds, not ionic bonds.',
        points: 3
      }
    ]
  },
  {
    id: 'class10-ch4-carbon-and-its-compounds',
    title: 'Chapter 4: Carbon and Its Compounds',
    description: 'Comprehensive test covering Covalent Bonding in Carbon, Versatile Nature of Carbon, Homologous Series, IUPAC Nomenclature, Isomerism, Chemical Properties of Carbon Compounds, Soaps & Detergents, Assertion-Reason, and Case Study questions.',
    category: 'Class 10',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T16:45:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 10) ---
      {
        id: 'c10-ch4-q1',
        question: 'Which of the following statements are correct for carbon compounds?\n(i) Most carbon compounds are good conductors of electricity.\n(ii) Most carbon compounds are poor conductors of electricity.\n(iii) Force of attraction between molecules of carbon compounds is not very strong.\n(iv) Force of attraction between molecules of carbon compounds is very strong.',
        options: [
          '(ii) and (iv)',
          '(ii) and (iii)',
          '(i) and (iv)',
          '(i) and (iii)'
        ],
        correctAnswer: 1,
        explanation: 'Carbon compounds are covalent in nature with no free ions or mobile electrons, making them poor conductors of electricity. Their intermolecular forces of attraction are weak, resulting in low melting and boiling points.',
        points: 2
      },
      {
        id: 'c10-ch4-q2',
        question: 'C₃H₈ belongs to the homologous series of:',
        options: [
          'Alkynes',
          'Alkenes',
          'Alkanes',
          'Cycloalkanes'
        ],
        correctAnswer: 2,
        explanation: 'C₃H₈ (propane) fits the general formula CₙH₂ₙ₊₂ where n=3 (C₃H₂₍₃₎₊₂ = C₃H₈). Therefore, it belongs to the alkane homologous series.',
        points: 2
      },
      {
        id: 'c10-ch4-q3',
        question: 'The IUPAC name of CH₃ - C(CH₃)₂ - CH₂ - CH₃ is:',
        options: [
          '2-ethyl-2-methyl propane',
          '2, 2-dimethyl butane',
          '1,1,1-trimethyl propane',
          '2, 2-methyl butane'
        ],
        correctAnswer: 1,
        explanation: 'The longest continuous carbon chain has 4 carbon atoms (butane). Numbering from the left gives substituents the lowest locants at carbon-2: two methyl groups. Hence, the IUPAC name is 2,2-dimethylbutane.',
        points: 2
      },
      {
        id: 'c10-ch4-q4',
        question: 'Which of the following is the correct formula of Butanoic acid?',
        options: [
          'CH₃CH₂CH₂CH₂COOH',
          'COOH - CH₂ - CH₂ - CH₂ - CH₃',
          'CH₃ - CH(COOH) - CH₂ - CH₃',
          'CH₃ - CH₂ - CH₂ - COOH'
        ],
        correctAnswer: 3,
        explanation: 'Butanoic acid contains 4 carbon atoms including the carbon of the carboxylic acid (-COOH) group: CH₃-CH₂-CH₂-COOH (molecular formula C₄H₈O₂).',
        points: 2
      },
      {
        id: 'c10-ch4-q5',
        question: 'The number of structural isomers of pentane (C₅H₁₂) is:',
        options: [
          '2',
          '3',
          '4',
          '5'
        ],
        correctAnswer: 1,
        explanation: 'Pentane (C₅H₁₂) has 3 structural chain isomers: n-pentane (CH₃-CH₂-CH₂-CH₂-CH₃), isopentane / 2-methylbutane (CH₃-CH(CH₃)-CH₂-CH₃), and neopentane / 2,2-dimethylpropane (C(CH₃)₄).',
        points: 2
      },
      {
        id: 'c10-ch4-q6',
        question: 'Which of the following will undergo addition reactions?',
        options: [
          'CH₄',
          'C₃H₈',
          'C₂H₆',
          'C₂H₄'
        ],
        correctAnswer: 3,
        explanation: 'Unsaturated hydrocarbons (alkenes and alkynes) undergo addition reactions across their double or triple bonds. Ethene (C₂H₄) is an alkene with a C=C double bond, whereas CH₄, C₃H₈, and C₂H₆ are saturated alkanes that undergo substitution reactions.',
        points: 2
      },
      {
        id: 'c10-ch4-q7',
        question: 'When ethanoic acid is treated with NaHCO₃, the gas evolved is:',
        options: [
          'H₂',
          'CO₂',
          'CH₄',
          'CO'
        ],
        correctAnswer: 1,
        explanation: 'Ethanoic acid reacts with sodium hydrogen carbonate (baking soda) with brisk effervescence to release carbon dioxide (CO₂) gas: CH₃COOH + NaHCO₃ ⟶ CH₃COONa + H₂O + CO₂↑.',
        points: 2
      },
      {
        id: 'c10-ch4-q8',
        question: 'Ethanol on complete oxidation / combustion gives:',
        options: [
          'acetic acid / ethanoic acid',
          'CO₂ and water',
          'ethanal',
          'acetone / ethanone'
        ],
        correctAnswer: 1,
        explanation: 'Complete oxidation (combustion) of ethanol burns it with a blue flame to produce carbon dioxide and water: C₂H₅OH + 3O₂ ⟶ 2CO₂ + 3H₂O + heat.',
        points: 2
      },
      {
        id: 'c10-ch4-q9',
        question: 'Which of the following will give a pleasant fruity smell of ester when heated with ethanol and a small quantity of concentrated sulphuric acid?',
        options: [
          'CH₃COOH',
          'CH₃CH₂OH',
          'CH₃OH',
          'CH₃CHO'
        ],
        correctAnswer: 0,
        explanation: 'Ethanoic acid (CH₃COOH) undergoes esterification with ethanol (C₂H₅OH) in the presence of conc. H₂SO₄ catalyst to produce sweet, fruity-smelling ethyl ethanoate ester: CH₃COOH + C₂H₅OH ⟶ CH₃COOC₂H₅ + H₂O.',
        points: 2
      },
      {
        id: 'c10-ch4-q10',
        question: 'Name the functional group present in CH₃COCH₃:',
        options: [
          'Alcohol',
          'Carboxylic acid',
          'Ketone',
          'Aldehyde'
        ],
        correctAnswer: 2,
        explanation: 'In CH₃COCH₃ (propanone / acetone), the carbonyl group (>C=O) is situated between two carbon atoms, which defines the ketone functional group.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c10-ch4-q11',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): Diamond and graphite do not have the same crystal structure.\nReason (R): Diamond is crystalline while graphite is amorphous.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 2,
        explanation: 'Assertion is true because diamond has a rigid 3D tetrahedral network of sp³ carbon atoms, whereas graphite has a 2D planar hexagonal layered lattice of sp² carbon atoms. Reason is false because both diamond and graphite are crystalline allotropes of carbon (neither is amorphous).',
        points: 3
      },
      {
        id: 'c10-ch4-q12',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): Olefins have the general formula CₙH₂ₙ₋₁.\nReason (R): There is at least one double bond between two carbon atoms in their molecules.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 3,
        explanation: 'Assertion is false because olefins (alkenes) have the general molecular formula CₙH₂ₙ (not CₙH₂ₙ₋₁). Reason is true because olefins are defined as unsaturated hydrocarbons possessing at least one carbon-carbon double bond (C=C).',
        points: 3
      },

      // --- Section 3: Case Study 1 (Homologous Series & Alkanes) ---
      {
        id: 'c10-ch4-q13',
        question: '[Case Study 1: Homologous Series]\nA hydrocarbon (P) has the molecular formula C₁₀H₂₂. Hydrocarbon (Q) has two carbon atoms less than (P) and belongs to the same homologous series. A hydrocarbon (R) has two carbon atoms more than (P) and belongs to the same homologous series.\n\nWhat is the molecular formula of (Q)?',
        options: [
          'C₁₂H₂₆',
          'C₈H₁₆',
          'C₈H₁₈',
          'C₈H₁₄'
        ],
        correctAnswer: 2,
        explanation: 'Compound (P) has 10 carbon atoms and formula C₁₀H₂₂, conforming to alkane formula CₙH₂ₙ₊₂. Compound (Q) has 10 - 2 = 8 carbon atoms. For n=8, its formula is C₈H₂₍₈₎₊₂ = C₈H₁₈.',
        points: 2
      },
      {
        id: 'c10-ch4-q14',
        question: '[Case Study 1: Homologous Series]\nTo which general formula / homologous series do the compounds (P), (Q) and (R) belong?',
        options: [
          'CₙH₂ₙ',
          'CₙH₂ₙ₋₂',
          'CₙH₂ₙ₊₂',
          'CₙH₂ₙ₊₁'
        ],
        correctAnswer: 2,
        explanation: 'All three compounds are alkanes and share the general molecular formula CₙH₂ₙ₊₂.',
        points: 2
      },
      {
        id: 'c10-ch4-q15',
        question: '[Case Study 1: Homologous Series]\nWhat is the molecular formula of (R)?',
        options: [
          'C₁₂H₂₆',
          'C₁₂H₂₄',
          'C₁₂H₂₂',
          'C₁₂H₂₈'
        ],
        correctAnswer: 0,
        explanation: 'Compound (R) has two carbon atoms more than (P), so n = 10 + 2 = 12. Its formula is C₁₂H₂₍₁₂₎₊₂ = C₁₂H₂₆.',
        points: 2
      },
      {
        id: 'c10-ch4-q16',
        question: '[Case Study 1: Homologous Series]\nIdentify the correct statement about compounds (P), (Q) and (R):',
        options: [
          'They have same melting and boiling points',
          'They have same chemical properties',
          'They have different general formula',
          'They differ by -CH unit'
        ],
        correctAnswer: 1,
        explanation: 'Members of the same homologous series possess identical functional groups and undergo the same types of chemical reactions, giving them identical chemical properties.',
        points: 3
      },
      {
        id: 'c10-ch4-q17',
        question: '[Case Study 1: Homologous Series]\nCompounds (P), (Q) and (R) are classified as:',
        options: [
          'Alkanes',
          'Alkenes',
          'Alkynes',
          'None of these'
        ],
        correctAnswer: 0,
        explanation: 'Saturated hydrocarbons with single carbon-carbon bonds and general formula CₙH₂ₙ₊₂ are called alkanes.',
        points: 3
      },

      // --- Section 4: Case Study 2 (Classification of Hydrocarbons) ---
      {
        id: 'c10-ch4-q18',
        question: '[Case Study 2: Organic Compounds Table]\nConsider the following six organic compounds:\nCompound A: C₇H₁₆\nCompound B: C₈H₁₆\nCompound C: C₄H₆\nCompound D: C₆H₁₀\nCompound E: C₅H₁₀\nCompound F: C₉H₂₀\n\nWhich of the following compounds belong to the same homologous series?',
        options: [
          'E and F',
          'B and C',
          'A and B',
          'C and D'
        ],
        correctAnswer: 3,
        explanation: 'Both C (C₄H₆) and D (C₆H₁₀) follow the general formula CₙH₂ₙ₋₂ (alkynes with a triple bond: 2(4)-2=6, 2(6)-2=10). Hence, C and D belong to the same alkyne homologous series.',
        points: 2
      },
      {
        id: 'c10-ch4-q19',
        question: '[Case Study 2: Organic Compounds Table]\nWhich of the following is a member of the same homologous series as E (C₅H₁₀)?',
        options: [
          'D',
          'A',
          'F',
          'B'
        ],
        correctAnswer: 3,
        explanation: 'Compound E (C₅H₁₀) has the general formula CₙH₂ₙ (alkene). Compound B (C₈H₁₆) also follows CₙH₂ₙ (2×8=16). Thus, B belongs to the same alkene series as E.',
        points: 2
      },
      {
        id: 'c10-ch4-q20',
        question: '[Case Study 2: Organic Compounds Table]\nIdentify the correct statement:',
        options: [
          'A and F are saturated hydrocarbons while all others are unsaturated hydrocarbons',
          'C and D belong to a homologous series having general formula CₙH₂ₙ',
          'B and E are alkynes',
          'All the compounds have same physical and chemical properties'
        ],
        correctAnswer: 0,
        explanation: 'A (C₇H₁₆) and F (C₉H₂₀) are alkanes (saturated hydrocarbons containing only single bonds). B and E are alkenes (double bond) and C and D are alkynes (triple bond), both being unsaturated hydrocarbons.',
        points: 2
      },
      {
        id: 'c10-ch4-q21',
        question: '[Case Study 2: Organic Compounds Table]\nCompound B (C₈H₁₆) is:',
        options: [
          'An alkane',
          'An alkene',
          'An alkyne',
          'None of these'
        ],
        correctAnswer: 1,
        explanation: 'Compound B has molecular formula C₈H₁₆, satisfying CₙH₂ₙ for n=8, which is an alkene (octene).',
        points: 3
      },
      {
        id: 'c10-ch4-q22',
        question: '[Case Study 2: Organic Compounds Table]\nCompound (F) with formula C₉H₂₀ has the general formula:',
        options: [
          'CₙH₂ₙ₋₁',
          'CₙH₂ₙ',
          'CₙH₂ₙ₋₂',
          'CₙH₂ₙ₊₂'
        ],
        correctAnswer: 3,
        explanation: 'For n=9, 2(9) + 2 = 20. Therefore, Compound F (C₉H₂₀) has the general formula CₙH₂ₙ₊₂ (an alkane, nonane).',
        points: 3
      }
    ]
  },
  {
    id: 'class10-ch5-periodic-classification-of-elements',
    title: 'Chapter 5: Periodic Classification of Elements',
    description: 'Comprehensive test covering Early Attempts at Classification (Dobereiner, Newlands, Mendeleev), Modern Periodic Law and Table, Trends in Periodic Properties (Valency, Atomic Size, Metallic and Non-metallic Character), Assertion-Reason, and Case Study questions.',
    category: 'Class 10',
    price: 299,
    duration_minutes: 35,
    total_marks: 50,
    reward_points: 50,
    is_active: true,
    created_at: new Date('2026-09-30T17:00:00Z').toISOString(),
    questions: [
      // --- Section 1: Multiple Choice Questions (1 to 10) ---
      {
        id: 'c10-ch5-q1',
        question: 'Newlands relation is called:',
        options: [
          'Musical Law',
          'Law of Octaves',
          'Periodic Law',
          'Atomic Mass Law'
        ],
        correctAnswer: 1,
        explanation: 'John Newlands arranged elements in order of increasing atomic masses and observed that every eighth element had properties similar to the first, comparing it to the octaves found in music. This is known as Newlands\' Law of Octaves.',
        points: 2
      },
      {
        id: 'c10-ch5-q2',
        question: 'Upto which element, the Law of Octaves was found applicable?',
        options: [
          'Oxygen',
          'Calcium',
          'Cobalt',
          'Potassium'
        ],
        correctAnswer: 1,
        explanation: 'Newlands\' Law of Octaves was found to be valid and applicable only up to calcium (atomic mass 40 u). Beyond calcium, every eighth element did not show properties similar to the first.',
        points: 2
      },
      {
        id: 'c10-ch5-q3',
        question: 'In Mendeleev\'s Periodic Table, gaps were left for the elements to be discovered later. Which of the following elements found a place in the Periodic Table later?',
        options: [
          'Chlorine',
          'Silicon',
          'Oxygen',
          'Germanium'
        ],
        correctAnswer: 3,
        explanation: 'Mendeleev left gaps for elements that were yet to be discovered and named them Eka-boron, Eka-aluminium, and Eka-silicon. Eka-silicon was later discovered and named Germanium (Ge).',
        points: 2
      },
      {
        id: 'c10-ch5-q4',
        question: 'At the time of Mendeleev, the number of elements known was:',
        options: [
          '63',
          '65',
          '62',
          '64'
        ],
        correctAnswer: 0,
        explanation: 'When Dmitri Ivanovich Mendeleev started formulating his periodic table in 1869, 63 elements were known to science.',
        points: 2
      },
      {
        id: 'c10-ch5-q5',
        question: 'The properties of eka-aluminium predicted by Mendeleev are the same as the properties of later discovered element:',
        options: [
          'Scandium',
          'Germanium',
          'Gallium',
          'Aluminium'
        ],
        correctAnswer: 2,
        explanation: 'Eka-aluminium predicted by Mendeleev was discovered in 1875 by Paul Emile Lecoq de Boisbaudran and named Gallium (Ga). Its properties closely matched Mendeleev\'s predictions.',
        points: 2
      },
      {
        id: 'c10-ch5-q6',
        question: 'An atom of an element has the electronic configuration 2, 8, 2. To which group does it belong?',
        options: [
          '4th group',
          '6th group',
          '3rd group',
          '2nd group'
        ],
        correctAnswer: 3,
        explanation: 'The group number in the s-block is equal to the number of valence electrons. Here, the number of valence electrons is 2, so the element (Magnesium) belongs to Group 2.',
        points: 2
      },
      {
        id: 'c10-ch5-q7',
        question: 'The arrangement of elements in the Modern Periodic Table is based on their:',
        options: [
          'increasing atomic mass in the period',
          'increasing atomic number in the horizontal rows',
          'increasing atomic number in the vertical columns',
          'increasing atomic mass in the group'
        ],
        correctAnswer: 1,
        explanation: 'According to Henry Moseley\'s Modern Periodic Law, physical and chemical properties of elements are periodic functions of their atomic numbers. In the table, elements are arranged in order of increasing atomic number in horizontal rows (periods).',
        points: 2
      },
      {
        id: 'c10-ch5-q8',
        question: 'Where would you locate the element with electronic configuration 2, 8 in the Modern Periodic Table?',
        options: [
          'Group 8',
          'Group 2',
          'Group 18',
          'Group 10'
        ],
        correctAnswer: 2,
        explanation: 'The element with electronic configuration 2, 8 is Neon (atomic number 10). It has a completely filled valence shell (stable octet) and is placed in Group 18 with noble gases.',
        points: 2
      },
      {
        id: 'c10-ch5-q9',
        question: 'Element \'X\' forms a chloride with the formula XCl₂, which is a solid with high melting point. X would most likely be in the same group of the periodic table as:',
        options: [
          'Si',
          'Mg',
          'Al',
          'Na'
        ],
        correctAnswer: 1,
        explanation: 'Formula XCl₂ indicates that X has a valency of 2 (forms X²⁺ ion). Magnesium (Mg) is a group 2 alkaline earth metal with valency 2 and forms ionic MgCl₂ with a high melting point.',
        points: 2
      },
      {
        id: 'c10-ch5-q10',
        question: 'Which of these belong to the same period of the periodic table?\nElement A: Atomic number 3\nElement B: Atomic number 10\nElement C: Atomic number 5',
        options: [
          'A, B',
          'B, C',
          'C, A',
          'A, B and C'
        ],
        correctAnswer: 3,
        explanation: 'Electronic configurations: A (Z=3) is 2, 1; B (Z=10) is 2, 8; C (Z=5) is 2, 3. All three elements have electrons in two energy shells (K and L shells), so all of them belong to the 2nd Period.',
        points: 2
      },

      // --- Section 2: Assertion-Reason Questions ---
      {
        id: 'c10-ch5-q11',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): Atomic size of As (Arsenic) is more than that of P (Phosphorus).\nReason (R): Atomic size decreases along a period.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 1,
        explanation: 'Both statements are factually correct: Arsenic has 4 shells while phosphorus has 3 shells in group 15, so atomic size of As is larger than P (Assertion is true). Across a period, atomic size decreases due to increasing nuclear charge (Reason is true). However, Reason describes the periodic trend and does not explain the group trend for As and P.',
        points: 3
      },
      {
        id: 'c10-ch5-q12',
        question: 'For the two statements given below, choose the correct option:\nAssertion (A): Chlorine is the most electronegative element of the halogen family.\nReason (R): Size of chlorine is more than that of fluorine.',
        options: [
          'Both A and R are true, and R is correct explanation of the assertion.',
          'Both A and R are true, but R is not the correct explanation of the assertion.',
          'A is true, but R is false.',
          'A is false, but R is true.'
        ],
        correctAnswer: 3,
        explanation: 'Assertion is false because Fluorine (F) is the most electronegative element in the halogen family (and in the entire periodic table, electronegativity = 4.0). Reason is true because chlorine has 3 shells whereas fluorine has 2 shells, so chlorine has a larger atomic radius.',
        points: 3
      },

      // --- Section 3: Case Study 1 (Modern Periodic Table Structure) ---
      {
        id: 'c10-ch5-q13',
        question: '[Case Study 1: Modern Periodic Table Structure]\n"Properties of elements are the periodic function of their atomic numbers." There are 18 groups and 7 periods. The period number equals the number of shells, and valence electrons determine the group number and chemical properties.\n\nWhat is the atomic number of the element of period 3 and group 17?',
        options: [
          '10',
          '14',
          '17',
          '12'
        ],
        correctAnswer: 2,
        explanation: 'Period 3 means 3 shells (K, L, M). Group 17 indicates 7 valence electrons in outermost shell. Electronic configuration = 2, 8, 7. Atomic number = 2 + 8 + 7 = 17 (Chlorine).',
        points: 2
      },
      {
        id: 'c10-ch5-q14',
        question: '[Case Study 1: Modern Periodic Table Structure]\nThe electronic configuration of an element is 2, 8, 6. Its period number and valency are respectively:',
        options: [
          '3, 2',
          '6, 6',
          '6, 2',
          '2, 2'
        ],
        correctAnswer: 0,
        explanation: 'The atom has 3 electron shells, so Period = 3. It has 6 valence electrons, so it needs 2 electrons to complete its octet, giving Valency = 8 - 6 = 2 (Sulphur).',
        points: 2
      },
      {
        id: 'c10-ch5-q15',
        question: '[Case Study 1: Modern Periodic Table Structure]\nAn element has mass number 40 and contains 20 neutrons in its atom. To which period and group of the periodic table does it belong?',
        options: [
          'Period-3, Group-3',
          'Period-4, Group-3',
          'Period-4, Group-2',
          'Period-4, Group-4'
        ],
        correctAnswer: 2,
        explanation: 'Atomic number Z = Mass number - Number of neutrons = 40 - 20 = 20. Electronic configuration = 2, 8, 8, 2. With 4 shells, it is in Period 4. With 2 valence electrons, it is in Group 2 (Calcium).',
        points: 2
      },
      {
        id: 'c10-ch5-q16',
        question: '[Case Study 1: Modern Periodic Table Structure]\nAn element \'X\' has an atomic number of 16. With which of the following elements will it show similar chemical properties?',
        options: [
          'Ne (10)',
          'N (7)',
          'O (8)',
          'Be (4)'
        ],
        correctAnswer: 2,
        explanation: 'Element X (Z=16, Sulphur) has configuration 2, 8, 6 (Group 16). Oxygen (Z=8) has configuration 2, 6 (also Group 16). Elements belonging to the same group have the same number of valence electrons and show similar chemical properties.',
        points: 3
      },
      {
        id: 'c10-ch5-q17',
        question: '[Case Study 1: Modern Periodic Table Structure]\nIdentify the statement(s) which is/are true for the modern periodic table:',
        options: [
          'It reflects trends in physical and chemical properties of the elements',
          'It helps to reflect the relative atomicity of bonds between any two elements',
          'It helps to predict the stable valency state of the elements',
          'All of these'
        ],
        correctAnswer: 3,
        explanation: 'The Modern Periodic Table systematically reflects periodic properties (atomic size, ionization energy, metallic character), helps predict stable oxidation/valency states, and clarifies the nature of chemical bonds.',
        points: 3
      },

      // --- Section 4: Case Study 2 (Periodicity and Trends in Properties) ---
      {
        id: 'c10-ch5-q18',
        question: '[Case Study 2: Periodic Trends]\nPeriodicity is the regular recurrence of similar properties when elements are arranged in increasing order of atomic numbers.\n\nFrom top to bottom in a group of the periodic table, the electropositive character of the elements:',
        options: [
          'Increases',
          'Decreases',
          'Remains unchanged',
          'Changes irregularly'
        ],
        correctAnswer: 0,
        explanation: 'Down a group, atomic radius increases and effective nuclear charge on valence electrons decreases, making it easier for atoms to lose valence electrons. Thus, electropositive (metallic) character increases down a group.',
        points: 2
      },
      {
        id: 'c10-ch5-q19',
        question: '[Case Study 2: Periodic Trends]\nWhich element has the largest atomic size in the second period?',
        options: [
          'N',
          'F',
          'Li',
          'Be'
        ],
        correctAnswer: 2,
        explanation: 'Across a period from left to right, atomic size decreases due to an increase in effective nuclear charge pulling electrons inward. Lithium (Li) is the leftmost element in period 2, hence it has the largest atomic radius.',
        points: 2
      },
      {
        id: 'c10-ch5-q20',
        question: '[Case Study 2: Periodic Trends]\nWhich of the following elements has three valence electrons?',
        options: [
          'Cs',
          'Ca',
          'Al',
          'S'
        ],
        correctAnswer: 2,
        explanation: 'Aluminium (Al, atomic number 13) has electronic configuration 2, 8, 3, with 3 valence electrons in its valence shell (Group 13).',
        points: 2
      },
      {
        id: 'c10-ch5-q21',
        question: '[Case Study 2: Periodic Trends]\nIn the periodic table, the metallic character of elements:',
        options: [
          'Decreases from left to right and decreases down the group',
          'Decreases from left to right and increases down the group',
          'Increases from left to right and increases down the group',
          'Increases from left to right and decreases down the group'
        ],
        correctAnswer: 1,
        explanation: 'Metallic character decreases across a period from left to right (as atoms tend to gain rather than lose electrons) and increases down a group (as atomic size increases, making electron loss easier).',
        points: 3
      },
      {
        id: 'c10-ch5-q22',
        question: '[Case Study 2: Periodic Trends]\nWhich of the following increases along a period from left to right?',
        options: [
          'Number of valence electrons',
          'Atomic size',
          'Electropositive character',
          'All of these'
        ],
        correctAnswer: 0,
        explanation: 'Across a period from left to right, the number of valence electrons increases sequentially from 1 to 8, whereas atomic size, metallic nature, and electropositive character all decrease.',
        points: 3
      }
    ]
  }
];

