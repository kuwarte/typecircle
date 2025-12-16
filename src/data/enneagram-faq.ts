export const enneagramFAQ = {
  general: [
    {
      question: "What is the Enneagram?",
      answer: "The Enneagram is a personality system that describes nine interconnected personality types. It reveals your core motivations, fears, and the unconscious patterns that drive your behavior."
    },
    {
      question: "How accurate is this assessment?",
      answer: "This assessment provides a good starting point for understanding your type. For the most accurate results, we recommend taking multiple assessments, reading about each type, and reflecting on your core motivations."
    },
    {
      question: "Can my type change over time?",
      answer: "Your core Enneagram type remains the same throughout your life. However, you can develop healthier patterns, integrate positive aspects of other types, and move along the levels of development."
    },
    {
      question: "What are wings?",
      answer: "Wings are the two types adjacent to your core type that influence your personality. For example, Type 1 can have a 9 wing (1w9) or a 2 wing (1w2), adding flavors to the core type."
    },
    {
      question: "What are the arrows or lines of integration/disintegration?",
      answer: "The arrows show how each type moves in stress (disintegration) and security (integration). In stress, you take on negative traits of another type. In growth, you develop positive traits of another type."
    },
    {
      question: "What are instinctual subtypes?",
      answer: "The three instinctual subtypes are Self-Preservation (focused on personal safety and comfort), Social (focused on group dynamics and belonging), and Sexual/One-to-One (focused on intensity and connection)."
    }
  ],
  
  typeDetails: {
    1: {
      wings: {
        "1w9": "The Idealist - More withdrawn, principled, and objective. Seeks perfection through inner harmony.",
        "1w2": "The Advocate - More interpersonal, helpful, and emotionally expressive. Seeks perfection through helping others."
      },
      arrows: {
        integration: "To 7 (Enthusiast) - Becomes more spontaneous, joyful, and open to new experiences.",
        disintegration: "To 4 (Individualist) - Becomes moody, self-critical, and emotionally volatile."
      },
      subtypes: {
        sp: "Self-Preservation 1s focus on perfecting their personal environment, health, and daily routines.",
        so: "Social 1s focus on improving society and being a model of correctness for others.",
        sx: "Sexual 1s focus on perfecting relationships and can be more intense and zealous."
      }
    },
    2: {
      wings: {
        "2w1": "The Servant - More principled, self-controlled, and critical. Helps others with high standards.",
        "2w3": "The Host/Hostess - More ambitious, image-conscious, and outgoing. Helps others while seeking recognition."
      },
      arrows: {
        integration: "To 4 (Individualist) - Becomes more self-aware, creative, and emotionally honest.",
        disintegration: "To 8 (Challenger) - Becomes demanding, controlling, and aggressive when needs aren't met."
      },
      subtypes: {
        sp: "Self-Preservation 2s focus on being indispensable and creating cozy, nurturing environments.",
        so: "Social 2s focus on being helpful to groups and gaining social recognition for their service.",
        sx: "Sexual 2s focus on being irresistible and seductive, often in romantic relationships."
      }
    },
    3: {
      wings: {
        "3w2": "The Charmer - More interpersonal, helpful, and people-focused. Achieves through relationships.",
        "3w4": "The Professional - More introspective, artistic, and individualistic. Achieves through unique contributions."
      },
      arrows: {
        integration: "To 6 (Loyalist) - Becomes more loyal, committed, and focused on team success.",
        disintegration: "To 9 (Peacemaker) - Becomes apathetic, disengaged, and loses motivation."
      },
      subtypes: {
        sp: "Self-Preservation 3s focus on personal security and can appear more like 6s, working hard for stability.",
        so: "Social 3s focus on social status and recognition, often becoming leaders or public figures.",
        sx: "Sexual 3s focus on being attractive and desirable, often emphasizing physical appearance and charisma."
      }
    },
    4: {
      wings: {
        "4w3": "The Aristocrat - More ambitious, image-conscious, and extroverted. Expresses uniqueness through achievement.",
        "4w5": "The Bohemian - More withdrawn, intellectual, and unconventional. Expresses uniqueness through creativity and ideas."
      },
      arrows: {
        integration: "To 1 (Perfectionist) - Becomes more disciplined, principled, and focused on improvement.",
        disintegration: "To 2 (Helper) - Becomes clingy, dependent, and manipulative when seeking attention."
      },
      subtypes: {
        sp: "Self-Preservation 4s focus on enduring suffering and can appear more stoic and long-suffering.",
        so: "Social 4s focus on social comparison and feeling inferior or superior to others.",
        sx: "Sexual 4s focus on competition and being more dramatic and emotionally intense."
      }
    },
    5: {
      wings: {
        "5w4": "The Iconoclast - More creative, intuitive, and emotionally expressive. Seeks knowledge through personal insight.",
        "5w6": "The Problem Solver - More practical, loyal, and security-oriented. Seeks knowledge through systematic study."
      },
      arrows: {
        integration: "To 8 (Challenger) - Becomes more confident, decisive, and willing to take action.",
        disintegration: "To 7 (Enthusiast) - Becomes scattered, impulsive, and seeks distractions from anxiety."
      },
      subtypes: {
        sp: "Self-Preservation 5s focus on minimizing needs and creating a secure, private sanctuary.",
        so: "Social 5s focus on knowledge and expertise as their way of connecting with groups.",
        sx: "Sexual 5s focus on finding the ideal relationship or pursuit that captures their total attention."
      }
    },
    6: {
      wings: {
        "6w5": "The Defender - More withdrawn, intellectual, and independent. Seeks security through knowledge and preparation.",
        "6w7": "The Buddy - More outgoing, optimistic, and playful. Seeks security through relationships and positive thinking."
      },
      arrows: {
        integration: "To 9 (Peacemaker) - Becomes more relaxed, trusting, and able to go with the flow.",
        disintegration: "To 3 (Achiever) - Becomes competitive, arrogant, and seeks success to prove worth."
      },
      subtypes: {
        sp: "Self-Preservation 6s focus on creating security through alliances and can appear more like 2s.",
        so: "Social 6s focus on duty and following social rules, often becoming pillars of their community.",
        sx: "Sexual 6s focus on strength and can be more aggressive and intimidating (counterphobic)."
      }
    },
    7: {
      wings: {
        "7w6": "The Entertainer - More responsible, loyal, and anxious. Seeks variety while maintaining connections.",
        "7w8": "The Realist - More aggressive, materialistic, and decisive. Seeks variety through power and control."
      },
      arrows: {
        integration: "To 5 (Investigator) - Becomes more focused, studious, and able to go deep into subjects.",
        disintegration: "To 1 (Perfectionist) - Becomes critical, impatient, and perfectionistic when constrained."
      },
      subtypes: {
        sp: "Self-Preservation 7s focus on creating networks and opportunities for security and pleasure.",
        so: "Social 7s focus on being helpful and contributing to groups while maintaining their optimism.",
        sx: "Sexual 7s focus on idealistic relationships and can be more intense and committed."
      }
    },
    8: {
      wings: {
        "8w7": "The Maverick - More enthusiastic, innovative, and aggressive. Seeks control through expansion and variety.",
        "8w9": "The Bear - More steady, stubborn, and protective. Seeks control through strength and endurance."
      },
      arrows: {
        integration: "To 2 (Helper) - Becomes more caring, supportive, and focused on helping others.",
        disintegration: "To 5 (Investigator) - Becomes withdrawn, secretive, and paranoid when threatened."
      },
      subtypes: {
        sp: "Self-Preservation 8s focus on survival and can be more focused on material security.",
        so: "Social 8s focus on protecting others and fighting for social justice and fairness.",
        sx: "Sexual 8s focus on possession and control in relationships, often being very intense."
      }
    },
    9: {
      wings: {
        "9w8": "The Referee - More assertive, practical, and direct. Seeks harmony through strength and leadership.",
        "9w1": "The Dreamer - More principled, orderly, and idealistic. Seeks harmony through improvement and correctness."
      },
      arrows: {
        integration: "To 3 (Achiever) - Becomes more focused, energetic, and goal-oriented.",
        disintegration: "To 6 (Loyalist) - Becomes anxious, reactive, and seeks external support when stressed."
      },
      subtypes: {
        sp: "Self-Preservation 9s focus on personal comfort and can be more focused on routine and habits.",
        so: "Social 9s focus on group harmony and often merge with social groups or causes.",
        sx: "Sexual 9s focus on merging with others and can be more romantic and idealistic about relationships."
      }
    }
  }
};