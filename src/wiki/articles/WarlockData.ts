// Auto-generated from https://warhammer-guide.ru/wiki/Warlock.html — do not edit by hand.
// Regenerate: python3 scripts/fetch-wiki-articles.py
export interface WikiRun {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  link?: string;
  runs?: WikiRun[];
  image?: string;
  alt?: string;
  br?: boolean;
}
export interface WikiCell {
  header: boolean;
  colspan?: number;
  rowspan?: number;
  bg?: string;
  runs: WikiRun[];
}
export type WikiBlock =
  | { block: 'p'; runs: WikiRun[] }
  | { block: 'table'; cls?: string; width?: string; rows: WikiCell[][] }
  | { block: 'toc'; items: { level: number; n: string; text: string; href: string }[] };
export interface WikiSection {
  h: string;
  level: number;
  anchor?: string;
  blocks: WikiBlock[];
}
export const WarlockArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Warlock",
  "subtitle": "From RelicWiki",
  "sections": [
    {
      "h": "",
      "level": 0,
      "anchor": "",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Dawn_of_War_logo.jpg",
                    "runs": [
                      {
                        "image": "images/80px-Dawn_of_War_logo.jpg",
                        "alt": "Dawn of War logo.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "This article is part of the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dawn_of_War_Players_Guide/",
                    "runs": [
                      {
                        "text": "Dawn of War Player's Guide",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ".",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "http://wiki.reliccommunity.com/",
                    "runs": [
                      {
                        "text": "From RelicWiki",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "cls": "messagebox",
          "width": "auto",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Dark_crusade_appicon.png",
                    "runs": [
                      {
                        "image": "images/Dark_crusade_appicon.png",
                        "alt": "Dark crusade appicon.png",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " This article has been updated for Soulstorm.",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "The Dark Crusade version is now ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock_Dark_Crusade/",
                    "runs": [
                      {
                        "text": "archived",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ".\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "cls": "messagebox",
          "width": "auto",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Warlock",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "tan",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Eldarwarlock.jpg",
                    "runs": [
                      {
                        "image": "images/Eldarwarlock.jpg",
                        "alt": "Eldarwarlock.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 2,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Race\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Eldar/",
                    "runs": [
                      {
                        "text": "Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Version\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Soulstorm/",
                    "runs": [
                      {
                        "text": "Soulstorm",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " v1.2\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Build Info",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "tan",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Unit Stats",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "tan",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Hitpoints\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "250/1",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Armour\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry Medium",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Morale Bonus\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "+100/+1",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Death Penalty\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "-37.5",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Unit Mass\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "15",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Move Speed\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "16\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Sight Radius\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "30 (detection 30)",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Weapons",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "tan",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Ranged\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Warlock/#Shuriken_Pistol",
                    "runs": [
                      {
                        "text": "Shuriken Pistol",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Melee\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Warlock/#Sword",
                    "runs": [
                      {
                        "text": "Sword",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "cls": "infobox",
          "width": "300px",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Warlock_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Warlock_icon.jpg",
                        "alt": "Warlock icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Hotkey\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "L\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "100%",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Build Cost\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Resource_requisition.gif",
                    "runs": [
                      {
                        "image": "images/Resource_requisition.gif",
                        "alt": "Resource requisition.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 55 ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "images/Resource_power.gif",
                    "runs": [
                      {
                        "image": "images/Resource_power.gif",
                        "alt": "Resource power.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 15 \n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Build Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "30 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Built In\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Guardian_Squad/",
                    "runs": [
                      {
                        "text": "Guardian Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Aspect_Portal/",
                    "runs": [
                      {
                        "text": "Aspect Portal",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "100%",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "toc",
          "items": [
            {
              "level": 0,
              "n": "1",
              "text": "Warlock",
              "href": "/settings/wiki/Warlock/#Warlock",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Tactics",
              "href": "/settings/wiki/Warlock/#Tactics",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "Abilities",
              "href": "/settings/wiki/Warlock/#Abilities",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.1",
              "text": "Leadership",
              "href": "/settings/wiki/Warlock/#Leadership",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.2",
              "text": "Embolden",
              "href": "/settings/wiki/Warlock/#Embolden",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.3",
              "text": "Entanglement",
              "href": "/settings/wiki/Warlock/#Entanglement",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.4",
              "text": "Conceal",
              "href": "/settings/wiki/Warlock/#Conceal",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "4",
              "text": "Weapons",
              "href": "/settings/wiki/Warlock/#Weapons",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.1",
              "text": "Shuriken Pistol",
              "href": "/settings/wiki/Warlock/#Shuriken_Pistol",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.2",
              "text": "Sword",
              "href": "/settings/wiki/Warlock/#Sword",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "5",
              "text": "Weapon Upgrades",
              "href": "/settings/wiki/Warlock/#Weapon_Upgrades",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.1",
              "text": "Power Sword",
              "href": "/settings/wiki/Warlock/#Power_Sword",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "6",
              "text": "Researchable Upgrades",
              "href": "/settings/wiki/Warlock/#Researchable_Upgrades",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "6.1",
              "text": "Mysticism",
              "href": "/settings/wiki/Warlock/#Mysticism",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "6.2",
              "text": "Fleet of Foot Research",
              "href": "/settings/wiki/Warlock/#Fleet_of_Foot_Research",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "6.3",
              "text": "Farseer Veteran Upgrade",
              "href": "/settings/wiki/Warlock/#Farseer_Veteran_Upgrade",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "6.4",
              "text": "Farseer Hero Upgrade",
              "href": "/settings/wiki/Warlock/#Farseer_Hero_Upgrade",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "7",
              "text": "The Dawn of War Player's Guide",
              "href": "/settings/wiki/Warlock/#The_Dawn_of_War_Player.27s_Guide",
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Warlock",
      "level": 2,
      "anchor": "Warlock",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "\"The burden of leadership lies with us.\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Warlocks are powerful psykers that lead their fellow ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Eldar/",
              "runs": [
                {
                  "text": "Eldar",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " into battle.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Tactics",
      "level": 2,
      "anchor": "Tactics",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Warlocks are the leaders of ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Guardian_Squad/",
              "runs": [
                {
                  "text": "Guardian Squads",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " that initially do little other than provide a damage bonus and detection. However, a Guardian squad ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "without",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " a Warlock will perform rather poorly as the Warlock provides the best damage bonus out of all squad leaders.  It is essential to research ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warlock/#Mysticism",
              "runs": [
                {
                  "text": "Mysticism",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " if you plan on making serious use of your ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Guardian_Squad/",
              "runs": [
                {
                  "text": "Guardian Squad",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " or later the ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Seer_Council/",
              "runs": [
                {
                  "text": "Seer Council",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ". ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warlock/#Mysticism",
              "runs": [
                {
                  "text": "Mysticism",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " provides better damage for the Warlock, better defense for the squad, and access to the abilities Entanglement and Embolden. Use Embolden to provide extra morale for your squad before an engagement and Entanglement to trap melee squads. Entanglement is especially devastating if used in conjunction with ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dark_Reaper_Squad/",
              "runs": [
                {
                  "text": "Dark Reaper Squads",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " or ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warp_Spider_Squad/",
              "runs": [
                {
                  "text": "Warp Spider Squads",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " and is even effective against jump troops.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Abilities",
      "level": 2,
      "anchor": "Abilities",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Leadership",
      "level": 3,
      "anchor": "Leadership",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Leadership",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/PassiveAbility_icon.jpg",
                    "runs": [
                      {
                        "image": "images/PassiveAbility_icon.jpg",
                        "alt": "PassiveAbility icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Warlock/#Mysticism",
                    "runs": [
                      {
                        "text": "Mysticism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Target Types\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Self\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Range\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Area of effect\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Entire squad\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cooldown time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Passive ability\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Effects\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "The Warlock inspires his squad to fight harder. The squad's Weapon Damage is increased by 20%.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "60%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Embolden",
      "level": 3,
      "anchor": "Embolden",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Embolden",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Hotkey: B\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Embolden_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Embolden_icon.jpg",
                        "alt": "Embolden icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Warlock/#Mysticism",
                    "runs": [
                      {
                        "text": "Mysticism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Target Types\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Self\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Range\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Area of effect\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Entire squad\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cooldown time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "150 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Effects\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "The Warlock uses his psychic powers to lift the hearts of his fellow soldiers.  The maximum morale of the squad is increased by 200 for 20 seconds.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "60%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Entanglement",
      "level": 3,
      "anchor": "Entanglement",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Entanglement",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Hotkey: N\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Eldar_Entanglement_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Eldar_Entanglement_icon.jpg",
                        "alt": "Eldar Entanglement icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Warlock/#Mysticism",
                    "runs": [
                      {
                        "text": "Mysticism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Target Types\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Enemy Infantry, Heavy Infantry, Commander, and Daemon Medium\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Range\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "30\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Area of effect\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Entire targeted squad\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cooldown time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "150 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Effects\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "The Warlock ensnares an enemy squad, holding them fast for 5 seconds. The affected squad cannot move for the duration of the ability, including the use of jumps.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "60%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Conceal",
      "level": 3,
      "anchor": "Conceal",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Conceal",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "bg": "#a377b5",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/PassiveAbility_icon.jpg",
                    "runs": [
                      {
                        "image": "images/PassiveAbility_icon.jpg",
                        "alt": "PassiveAbility icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Warlock/#Mysticism",
                    "runs": [
                      {
                        "text": "Mysticism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Target Types\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Self\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Range\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Area of effect\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Entire squad\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cooldown time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Passive ability\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Effects\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "The Warlock shrouds his squad with his psychic powers reducing the damage they take from ranged fire by 25%. This is a passive ability and is always active after ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Researchable_Upgrades",
                    "runs": [
                      {
                        "text": "Mysticism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " is researched. Unlike the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Seer_Council/",
                    "runs": [
                      {
                        "text": "Seer Council",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "link": "/settings/wiki/Seer_Council/#Conceal",
                    "runs": [
                      {
                        "text": "variant",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ", the Warlock's Conceal effects an attached ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " as well.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "60%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Weapons",
      "level": 2,
      "anchor": "Weapons",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Shuriken Pistol",
      "level": 3,
      "anchor": "Shuriken_Pistol",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Shuriken Pistol",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cost\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Default Weapon",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Range\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "25\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Setup Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Build Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Default Weapon",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Accuracy\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "70% (100% w/ ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/#Guide",
                    "runs": [
                      {
                        "text": "Guide",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " which increases the DPS by 42.9%)\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Refire Rate\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Area of Effect\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Nothing\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "90%",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/RangedStance_icon_bw.jpg",
                    "runs": [
                      {
                        "image": "images/RangedStance_icon_bw.jpg",
                        "alt": "RangedStance icon bw.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Damage Per Second Values",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 17,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#c2e1f6",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#93a9d5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#c2e1f6",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Daemons",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "#93a9d5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Morale",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "#7B68EE",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Base Damage",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#9771b7",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " H.Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " H.Hi\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Cmdr\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Air\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " DPS\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Base\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Min\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Max\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Min.D\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Initial ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/DPS/",
                    "runs": [
                      {
                        "text": "DPS",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " (",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "includes ",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Leadership",
                    "runs": [
                      {
                        "text": "Leadership",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " bonus",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "):\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "7.11\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "11.8\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "9.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "9.5\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "7.8\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "5.1\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.8\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0.7\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0.7\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.5\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "5.2\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.9\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0.7\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "8.2\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0.7\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0.4\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "16.8\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "33.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "100%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Sword",
      "level": 3,
      "anchor": "Sword",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Sword",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cost\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Default Weapon",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Range\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "melee",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Setup Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Build Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Default Weapon",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Accuracy\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "65% (95% w/ ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/#Guide",
                    "runs": [
                      {
                        "text": "Guide",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " which increases the DPS by 46.2%)\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Refire Rate\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0.8 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Area of Effect\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Nothing\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "90%",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/MeleeStance_icon_bw.jpg",
                    "runs": [
                      {
                        "image": "images/MeleeStance_icon_bw.jpg",
                        "alt": "MeleeStance icon bw.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Damage Per Second Values",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 17,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#c2e1f6",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#93a9d5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#c2e1f6",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Daemons",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "#93a9d5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Morale",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "#7B68EE",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Base Damage",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#9771b7",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " H.Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " H.Hi\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Cmdr\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Air\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " DPS\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Base\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Min\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Max\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Min.D\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Initial ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/DPS/",
                    "runs": [
                      {
                        "text": "DPS",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " (",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "includes ",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Leadership",
                    "runs": [
                      {
                        "text": "Leadership",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " bonus",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "):\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "10.5\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "16.2\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "11.7\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "10.5\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "6.9\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "5.1\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "5.9\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "10.2\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "1.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "4.1\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "10\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "33\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "39\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "2\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "100%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Weapon Upgrades",
      "level": 2,
      "anchor": "Weapon_Upgrades",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Power Sword",
      "level": 3,
      "anchor": "Power_Sword",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Power Sword",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [],
                "bg": "#ed717a",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cost\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "See ",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Mysticism",
                    "runs": [
                      {
                        "text": "Mysticism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Range\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Melee\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Setup Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Build Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "See ",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Mysticism",
                    "runs": [
                      {
                        "text": "Mysticism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Accuracy\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "65% (95% w/ ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/#Guide",
                    "runs": [
                      {
                        "text": "Guide",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " which increases the DPS by 46.2%)\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Refire Rate\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0.8 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Area of Effect\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "0\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Warlock/#Mysticism",
                    "runs": [
                      {
                        "text": "Mysticism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Notes\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "The Power Sword permanently replaces the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Sword",
                    "runs": [
                      {
                        "text": "Sword",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " when researched\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 5,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "90%",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Conceal_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Conceal_icon.jpg",
                        "alt": "Conceal icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Damage Per Second Values",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 17,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#c2e1f6",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#93a9d5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#c2e1f6",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Daemons",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "#93a9d5",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Morale",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 2,
                "bg": "#7B68EE",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Base Damage",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "bg": "#9771b7",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " H.Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " H.Hi\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Cmdr\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Air\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Low\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Med\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " High\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " DPS\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Base\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Min\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Max\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": " Min.D\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Initial ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/DPS/",
                    "runs": [
                      {
                        "text": "DPS",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " (",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "includes ",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Leadership",
                    "runs": [
                      {
                        "text": "Leadership",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " bonus",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "):\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "13.2\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "20.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "14.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "13.2\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "8.6\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "6.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "3.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "3.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "3.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "3.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "7.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "3.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "3.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "12.8\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "3.3\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "4.1\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "10\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "40.5\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "49.5\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "4\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "lightgrey",
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "100%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Researchable Upgrades",
      "level": 2,
      "anchor": "Researchable_Upgrades",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Mysticism",
      "level": 3,
      "anchor": "Mysticism",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Mysticism",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Hotkey: C\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Conceal_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Conceal_icon.jpg",
                        "alt": "Conceal icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cost\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Resource_requisition.gif",
                    "runs": [
                      {
                        "image": "images/Resource_requisition.gif",
                        "alt": "Resource requisition.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 125 ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "images/Resource_power.gif",
                    "runs": [
                      {
                        "image": "images/Resource_power.gif",
                        "alt": "Resource power.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 65 \n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Research Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "50 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Researched From\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Webway_Assembly/",
                    "runs": [
                      {
                        "text": "Webway Assembly",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Nothing\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Effects\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Enable ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlocks",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " and the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Seer_Council/",
                    "runs": [
                      {
                        "text": "Seer Council",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " to use the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Conceal",
                    "runs": [
                      {
                        "text": "Conceal",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " and ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Embolden",
                    "runs": [
                      {
                        "text": "Embolden",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " abilities.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Enable ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlocks",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " to use the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Leadership",
                    "runs": [
                      {
                        "text": "Leadership",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " and ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Entanglement",
                    "runs": [
                      {
                        "text": "Entanglement",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " ability.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Equips ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlocks",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " with a ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Power_Sword",
                    "runs": [
                      {
                        "text": "Power Sword",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ".\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "50%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Fleet of Foot Research",
      "level": 3,
      "anchor": "Fleet_of_Foot_Research",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Fleet of Foot Research",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Hotkey: F\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Fleetoffoot_research_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Fleetoffoot_research_icon.jpg",
                        "alt": "Fleetoffoot research icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cost\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Resource_requisition.gif",
                    "runs": [
                      {
                        "image": "images/Resource_requisition.gif",
                        "alt": "Resource requisition.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 50 ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "images/Resource_power.gif",
                    "runs": [
                      {
                        "image": "images/Resource_power.gif",
                        "alt": "Resource power.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 50 \n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Research Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "60 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Researched From\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Webway_Assembly/",
                    "runs": [
                      {
                        "text": "Webway Assembly",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Nothing\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Effects\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Activates the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlock/#Fleet_of_Foot",
                    "runs": [
                      {
                        "text": "Fleet of Foot",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " ability for ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Guardian_Squad/",
                    "runs": [
                      {
                        "text": "Guardian Squads",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ", ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ranger_Squad/",
                    "runs": [
                      {
                        "text": "Ranger Squads",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ", ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Howling_Banshee_Squad/",
                    "runs": [
                      {
                        "text": "Howling Banshee Squads",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ", ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dark_Reaper_Squad/",
                    "runs": [
                      {
                        "text": "Dark Reaper Squads",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ", ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fire_Dragon_Squad/",
                    "runs": [
                      {
                        "text": "Fire Dragon Squads",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ", ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ", and the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Seer_Council/",
                    "runs": [
                      {
                        "text": "Seer Council",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ".\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "50%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Farseer Veteran Upgrade",
      "level": 3,
      "anchor": "Farseer_Veteran_Upgrade",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Farseer Veteran Upgrade",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Hotkey: H\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Farseerhealth1_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Farseerhealth1_icon.jpg",
                        "alt": "Farseerhealth1 icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cost\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Resource_requisition.gif",
                    "runs": [
                      {
                        "image": "images/Resource_requisition.gif",
                        "alt": "Resource requisition.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 100 ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "images/Resource_power.gif",
                    "runs": [
                      {
                        "image": "images/Resource_power.gif",
                        "alt": "Resource power.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 25 \n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Research Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "39 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Researched From\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Soul_Shrine/",
                    "runs": [
                      {
                        "text": "Soul Shrine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Nothing\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Effects\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " health by 400 to 1710. \n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " health regeneration rate by 0.5 HP/sec.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Decreases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " ability recharge time by 10%.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/#Witchblade",
                    "runs": [
                      {
                        "text": "Witchblade",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " damage by 15%.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlock",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health by 150 to 400.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Harlequin/",
                    "runs": [
                      {
                        "text": "Harlequin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " health by 150 to 775.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "50%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Farseer Hero Upgrade",
      "level": 3,
      "anchor": "Farseer_Hero_Upgrade",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [],
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Farseer Hero Upgrade",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 3,
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Hotkey: H\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#edcc79",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Farseerhealth2_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Farseerhealth2_icon.jpg",
                        "alt": "Farseerhealth2 icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Cost\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Resource_requisition.gif",
                    "runs": [
                      {
                        "image": "images/Resource_requisition.gif",
                        "alt": "Resource requisition.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 125 ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "images/Resource_power.gif",
                    "runs": [
                      {
                        "image": "images/Resource_power.gif",
                        "alt": "Resource power.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 50 \n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Research Time\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "50 s\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Researched From\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Soul_Shrine/",
                    "runs": [
                      {
                        "text": "Soul Shrine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Requires\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Warlock/#Farseer_Veteran_Upgrade",
                    "runs": [
                      {
                        "text": "Farseer Veteran Upgrade",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 3,
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "text": "Effects\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " health by a further 300 to 2010.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " health regeneration rate by a further 0.5 HP/sec.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Decreases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " ability recharge time by a further 10% (19% total).\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Increase ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/#Witchblade",
                    "runs": [
                      {
                        "text": "Witchblade",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " damage by a further 20% (38% total).\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlock",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health by a further 150 to 550.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Increases ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Harlequin/",
                    "runs": [
                      {
                        "text": "Harlequin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " health by a further 150 to 925.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 4,
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "width": "50%",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "The Dawn of War Player's Guide",
      "level": 2,
      "anchor": "The_Dawn_of_War_Player.27s_Guide",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dawn_of_War_Players_Guide/",
                    "runs": [
                      {
                        "text": "The Dawn of War Player's Guide",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " - Thought of the day: Knowledge is power, guard it well.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 9,
                "bg": "#ccddcc",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Space_Marines/",
                    "runs": [
                      {
                        "text": "Space Marines",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Chaos/",
                    "runs": [
                      {
                        "text": "Chaos",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Eldar/",
                    "runs": [
                      {
                        "text": "Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Orks/",
                    "runs": [
                      {
                        "text": "Orks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Imperial Guard",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Tau/",
                    "runs": [
                      {
                        "text": "Tau",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Necrons/",
                    "runs": [
                      {
                        "text": "Necrons",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Dark Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Sisters of Battle",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Servitor/",
                    "runs": [
                      {
                        "text": "Servitor",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Scout_Marine_Squad/",
                    "runs": [
                      {
                        "text": "Scout Marine Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Space_Marine_Squad/",
                    "runs": [
                      {
                        "text": "Space Marine Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Assault_Marine_Squad/",
                    "runs": [
                      {
                        "text": "Assault Marine Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Grey_Knights/",
                    "runs": [
                      {
                        "text": "Grey Knights",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Terminator_Squad/",
                    "runs": [
                      {
                        "text": "Terminator Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Assault_Terminator_Squad/",
                    "runs": [
                      {
                        "text": "Assault Terminator Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Skull_Probe/",
                    "runs": [
                      {
                        "text": "Skull Probe",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Apothecary/",
                    "runs": [
                      {
                        "text": "Apothecary",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Force_Commander/",
                    "runs": [
                      {
                        "text": "Force Commander",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Librarian/",
                    "runs": [
                      {
                        "text": "Librarian",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaplain/",
                    "runs": [
                      {
                        "text": "Chaplain",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heretic/",
                    "runs": [
                      {
                        "text": "Heretic",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Cultist_Squad/",
                    "runs": [
                      {
                        "text": "Cultist Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Space_Marine_Squad/",
                    "runs": [
                      {
                        "text": "Chaos Space Marine Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Raptor_Squad/",
                    "runs": [
                      {
                        "text": "Raptor Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Khorne_Berzerker_Squad/",
                    "runs": [
                      {
                        "text": "Khorne Berzerker Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Horror_Squad/",
                    "runs": [
                      {
                        "text": "Horror Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Possessed_Squad/",
                    "runs": [
                      {
                        "text": "Possessed Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Obliterators/",
                    "runs": [
                      {
                        "text": "Obliterators",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Lord/",
                    "runs": [
                      {
                        "text": "Chaos Lord",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Sorcerer/",
                    "runs": [
                      {
                        "text": "Chaos Sorcerer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Daemon_Prince/",
                    "runs": [
                      {
                        "text": "Daemon Prince",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Bloodthirster/",
                    "runs": [
                      {
                        "text": "Bloodthirster",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Bonesinger/",
                    "runs": [
                      {
                        "text": "Bonesinger",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Guardian_Squad/",
                    "runs": [
                      {
                        "text": "Guardian Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ranger_Squad/",
                    "runs": [
                      {
                        "text": "Ranger Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Howling_Banshee_Squad/",
                    "runs": [
                      {
                        "text": "Howling Banshee Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dark_Reaper_Squad/",
                    "runs": [
                      {
                        "text": "Dark Reaper Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fire_Dragon/",
                    "runs": [
                      {
                        "text": "Fire Dragon Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warp_Spider_Squad/",
                    "runs": [
                      {
                        "text": "Warp Spider Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Harlequin/",
                    "runs": [
                      {
                        "text": "Harlequin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Seer_Council/",
                    "runs": [
                      {
                        "text": "Seer Council",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Avatar_of_Khaine/",
                    "runs": [
                      {
                        "text": "Avatar of Khaine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Gretchin/",
                    "runs": [
                      {
                        "text": "Gretchin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Slugga_Boy_Squad/",
                    "runs": [
                      {
                        "text": "Slugga Boy Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Shoota_Boy_Squad/",
                    "runs": [
                      {
                        "text": "Shoota Boy Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Stormboyz/",
                    "runs": [
                      {
                        "text": "Stormboyz",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tankbustaz/",
                    "runs": [
                      {
                        "text": "Tankbustaz",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Nobz_Squad/",
                    "runs": [
                      {
                        "text": "Nobz Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Flash_Gitz/",
                    "runs": [
                      {
                        "text": "Flash Gitz",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mega_Armoured_Nobz/",
                    "runs": [
                      {
                        "text": "Mega Armoured Nobz",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mad_Dok/",
                    "runs": [
                      {
                        "text": "Mad Dok",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warboss/",
                    "runs": [
                      {
                        "text": "Warboss",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Techpriest_Enginseer/",
                    "runs": [
                      {
                        "text": "Techpriest Enginseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/guardsmen_squad/",
                    "runs": [
                      {
                        "text": "Guardsmen Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Weapons_Team/",
                    "runs": [
                      {
                        "text": "Heavy Weapons Team",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kasrkin/",
                    "runs": [
                      {
                        "text": "Kasrkin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ogryns/",
                    "runs": [
                      {
                        "text": "Ogryns",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Command_Squad/",
                    "runs": [
                      {
                        "text": "Command Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Commissar/",
                    "runs": [
                      {
                        "text": "Commissar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Psyker/",
                    "runs": [
                      {
                        "text": "Psyker",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Priest/",
                    "runs": [
                      {
                        "text": "Priest",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Vindicare_Assassin/",
                    "runs": [
                      {
                        "text": "Vindicare Assassin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Earth_Caste_Builder/",
                    "runs": [
                      {
                        "text": "Earth Caste Builder",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/XV15_Stealth_Team/",
                    "runs": [
                      {
                        "text": "XV15 Stealth Team",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Vespid_Stingwing_Strain/",
                    "runs": [
                      {
                        "text": "Vespid Stingwing Strain",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fire_Warrior_Team/",
                    "runs": [
                      {
                        "text": "Fire Warrior Team",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kroot_Carnivores/",
                    "runs": [
                      {
                        "text": "Kroot Carnivores",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kroot_Shaper/",
                    "runs": [
                      {
                        "text": "Kroot Shaper",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Pathfinder_Team/",
                    "runs": [
                      {
                        "text": "Pathfinder Team",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/XV88_Broadside_Battlesuit/",
                    "runs": [
                      {
                        "text": "XV88 Broadside Battlesuit",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/XV8_Crisis_Battlesuit/",
                    "runs": [
                      {
                        "text": "XV8 Crisis Battlesuit",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kroot_Hound_Pack/",
                    "runs": [
                      {
                        "text": "Kroot Hound Pack",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tau_Commander/",
                    "runs": [
                      {
                        "text": "Tau Commander",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ethereal/",
                    "runs": [
                      {
                        "text": "Ethereal",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/ShasUi_Bodyguard/",
                    "runs": [
                      {
                        "text": "Shas'Ui Bodyguard",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Builder_Scarabs/",
                    "runs": [
                      {
                        "text": "Builder Scarabs",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Warriors/",
                    "runs": [
                      {
                        "text": "Necron Warriors",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wraith/",
                    "runs": [
                      {
                        "text": "Wraith",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Flayed_Ones/",
                    "runs": [
                      {
                        "text": "Flayed Ones",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Immortals/",
                    "runs": [
                      {
                        "text": "Immortals",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Pariahs/",
                    "runs": [
                      {
                        "text": "Pariahs",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Lord/",
                    "runs": [
                      {
                        "text": "Necron Lord",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Essence_of_the_Nightbringer/",
                    "runs": [
                      {
                        "text": "Essence of the Nightbringer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Essence_of_the_Deceiver/",
                    "runs": [
                      {
                        "text": "Essence of the Deceiver",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tortured_Slave/",
                    "runs": [
                      {
                        "text": "Tortured Slave",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mandrake_Squad/",
                    "runs": [
                      {
                        "text": "Mandrake Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warrior_Squad/",
                    "runs": [
                      {
                        "text": "Warrior Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hellion_Squad/",
                    "runs": [
                      {
                        "text": "Hellion Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Scourge_Squad/",
                    "runs": [
                      {
                        "text": "Scourge Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wych_Squad/",
                    "runs": [
                      {
                        "text": "Wych Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warp_Beast_Pack/",
                    "runs": [
                      {
                        "text": "Warp Beast Pack",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Archon/",
                    "runs": [
                      {
                        "text": "Archon",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Haemonculus/",
                    "runs": [
                      {
                        "text": "Haemonculus",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ecclesiarchal_Servitor/",
                    "runs": [
                      {
                        "text": "Ecclesiarchal Servitor",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Missionary/",
                    "runs": [
                      {
                        "text": "Missionary",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Battle_Sister_Squad/",
                    "runs": [
                      {
                        "text": "Battle Sister Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Seraphim_Squad/",
                    "runs": [
                      {
                        "text": "Seraphim Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Celestian_Squad/",
                    "runs": [
                      {
                        "text": "Celestian Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Death-Cult_Assassin/",
                    "runs": [
                      {
                        "text": "Death-Cult Assassin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Sister_Repentia_Squad/",
                    "runs": [
                      {
                        "text": "Sister Repentia Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Canoness/",
                    "runs": [
                      {
                        "text": "Canoness",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Avenging_Angel/",
                    "runs": [
                      {
                        "text": "Avenging Angel",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Confessor/",
                    "runs": [
                      {
                        "text": "Confessor",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Living_Saint/",
                    "runs": [
                      {
                        "text": "Living Saint",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Space_Marines/",
                    "runs": [
                      {
                        "text": "Space Marines",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Chaos/",
                    "runs": [
                      {
                        "text": "Chaos",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Eldar/",
                    "runs": [
                      {
                        "text": "Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Orks/",
                    "runs": [
                      {
                        "text": "Orks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Imperial Guard",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Tau/",
                    "runs": [
                      {
                        "text": "Tau",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Necrons/",
                    "runs": [
                      {
                        "text": "Necrons",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Dark Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Sisters of Battle",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Rhino/",
                    "runs": [
                      {
                        "text": "Rhino",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Land_Speeder/",
                    "runs": [
                      {
                        "text": "Land Speeder",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dreadnought/",
                    "runs": [
                      {
                        "text": "Dreadnought",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hellfire_Dreadnought/",
                    "runs": [
                      {
                        "text": "Hellfire Dreadnought",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Land_Speeder_Tempest/",
                    "runs": [
                      {
                        "text": "Land Speeder Tempest",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Predator/",
                    "runs": [
                      {
                        "text": "Predator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Whirlwind/",
                    "runs": [
                      {
                        "text": "Whirlwind",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Land_Raider/",
                    "runs": [
                      {
                        "text": "Land Raider",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Rhino/",
                    "runs": [
                      {
                        "text": "Chaos Rhino",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Defiler/",
                    "runs": [
                      {
                        "text": "Defiler",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Predator/",
                    "runs": [
                      {
                        "text": "Chaos Predator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hell_Talon/",
                    "runs": [
                      {
                        "text": "Hell Talon",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Falcon_Grav_Tank/",
                    "runs": [
                      {
                        "text": "Falcon Grav Tank",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Vyper/",
                    "runs": [
                      {
                        "text": "Vyper",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wraithlord/",
                    "runs": [
                      {
                        "text": "Wraithlord",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Nightwing/",
                    "runs": [
                      {
                        "text": "Nightwing",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Shuriken_Grav_Platform/",
                    "runs": [
                      {
                        "text": "Shuriken Grav Platform",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Brightlance_Grav_Platform/",
                    "runs": [
                      {
                        "text": "Brightlance Grav Platform",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fire_Prism/",
                    "runs": [
                      {
                        "text": "Fire Prism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wartrukk/",
                    "runs": [
                      {
                        "text": "Wartrukk",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wartrak/",
                    "runs": [
                      {
                        "text": "Wartrak",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Killa_Kan/",
                    "runs": [
                      {
                        "text": "Killa Kan",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fighta-Bomma/",
                    "runs": [
                      {
                        "text": "Fighta-Bomma",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Looted_Tank/",
                    "runs": [
                      {
                        "text": "Looted Tank",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Squiggoth/",
                    "runs": [
                      {
                        "text": "Squiggoth",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chimera/",
                    "runs": [
                      {
                        "text": "Chimera",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Sentinel/",
                    "runs": [
                      {
                        "text": "Sentinel",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hellhound/",
                    "runs": [
                      {
                        "text": "Hellhound",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Basilisk/",
                    "runs": [
                      {
                        "text": "Basilisk",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Marauder_Bomber/",
                    "runs": [
                      {
                        "text": "Marauder Bomber",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Leman_Russ/",
                    "runs": [
                      {
                        "text": "Leman Russ",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Baneblade/",
                    "runs": [
                      {
                        "text": "Baneblade",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Devilfish_Troop_Carrier/",
                    "runs": [
                      {
                        "text": "Devilfish Troop Carrier",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Skyray_Missile_Gunship/",
                    "runs": [
                      {
                        "text": "Skyray Missile Gunship",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Drone_Squad/",
                    "runs": [
                      {
                        "text": "Drone Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Drone_Harbinger/",
                    "runs": [
                      {
                        "text": "Drone Harbinger",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Barracuda/",
                    "runs": [
                      {
                        "text": "Barracuda",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hammerhead_Gunship/",
                    "runs": [
                      {
                        "text": "Hammerhead Gunship",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Krootox/",
                    "runs": [
                      {
                        "text": "Krootox",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Greater_Knarloc/",
                    "runs": [
                      {
                        "text": "Greater Knarloc",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tomb_Spyder/",
                    "runs": [
                      {
                        "text": "Tomb Spyder",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Attack_Scarabs/",
                    "runs": [
                      {
                        "text": "Attack Scarabs",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Destroyer/",
                    "runs": [
                      {
                        "text": "Destroyer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Destroyer/",
                    "runs": [
                      {
                        "text": "Heavy Destroyer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Lord_Destroyer/",
                    "runs": [
                      {
                        "text": "Lord Destroyer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Restored_Monolith/",
                    "runs": [
                      {
                        "text": "Restored Monolith",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Reaver_Jetbike/",
                    "runs": [
                      {
                        "text": "Reaver Jetbike",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Raider/",
                    "runs": [
                      {
                        "text": "Raider",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Talos/",
                    "runs": [
                      {
                        "text": "Talos",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Raven/",
                    "runs": [
                      {
                        "text": "Raven",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ravager/",
                    "runs": [
                      {
                        "text": "Ravager",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dais_of_Destruction/",
                    "runs": [
                      {
                        "text": "Dais of Destruction",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Rhino_Transport/",
                    "runs": [
                      {
                        "text": "Rhino Transport",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Immolator/",
                    "runs": [
                      {
                        "text": "Immolator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Lightning_Fighter/",
                    "runs": [
                      {
                        "text": "Lightning Fighter",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Exorcist/",
                    "runs": [
                      {
                        "text": "Exorcist",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Penitent_Engine/",
                    "runs": [
                      {
                        "text": "Penitent Engine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Space_Marines/",
                    "runs": [
                      {
                        "text": "Space Marines",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Chaos/",
                    "runs": [
                      {
                        "text": "Chaos",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Eldar/",
                    "runs": [
                      {
                        "text": "Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Orks/",
                    "runs": [
                      {
                        "text": "Orks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Imperial Guard",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Tau/",
                    "runs": [
                      {
                        "text": "Tau",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Necrons/",
                    "runs": [
                      {
                        "text": "Necrons",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Dark Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Sisters of Battle",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Stronghold/",
                    "runs": [
                      {
                        "text": "Stronghold",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Space_Marines/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Space_Marines/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Space_Marines/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chapel-Barracks/",
                    "runs": [
                      {
                        "text": "Chapel-Barracks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Armoury/",
                    "runs": [
                      {
                        "text": "Armoury",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Machine_Cult/",
                    "runs": [
                      {
                        "text": "Machine Cult",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Sacred_Artifact/",
                    "runs": [
                      {
                        "text": "Sacred Artifact",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Orbital_Relay/",
                    "runs": [
                      {
                        "text": "Orbital Relay",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Bolter_Turret_Space_Marines/",
                    "runs": [
                      {
                        "text": "Heavy Bolter Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Space_Marines/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Desecrated_Stronghold/",
                    "runs": [
                      {
                        "text": "Desecrated Stronghold",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Chaos/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Chaos/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Chaos/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Temple/",
                    "runs": [
                      {
                        "text": "Chaos Temple",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Armoury/",
                    "runs": [
                      {
                        "text": "Chaos Armoury",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Sacrificial_Circle/",
                    "runs": [
                      {
                        "text": "Sacrificial Circle",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Machine_Pit/",
                    "runs": [
                      {
                        "text": "Machine Pit",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Daemon_Pit/",
                    "runs": [
                      {
                        "text": "Daemon Pit",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Bolter_Turret_Chaos/",
                    "runs": [
                      {
                        "text": "Heavy Bolter Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Chaos/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Webway_Assembly/",
                    "runs": [
                      {
                        "text": "Webway Assembly",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Shrine/",
                    "runs": [
                      {
                        "text": "Listening Shrine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Eldar/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Eldar/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Webway_Gate/",
                    "runs": [
                      {
                        "text": "Webway Gate",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Aspect_Portal/",
                    "runs": [
                      {
                        "text": "Aspect Portal",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Soul_Shrine/",
                    "runs": [
                      {
                        "text": "Soul Shrine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Support_Portal/",
                    "runs": [
                      {
                        "text": "Support Portal",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Support_Platform/",
                    "runs": [
                      {
                        "text": "Support Platform",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Eldar/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Settlement/",
                    "runs": [
                      {
                        "text": "Settlement",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Da_Listenin_Post/",
                    "runs": [
                      {
                        "text": "Da Listenin' Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Generator/",
                    "runs": [
                      {
                        "text": "Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Bigga_Generator/",
                    "runs": [
                      {
                        "text": "Bigga Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Waaagh_Banner/",
                    "runs": [
                      {
                        "text": "Waaagh! Banner",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Da_Boyz_Hut/",
                    "runs": [
                      {
                        "text": "Da Boyz Hut",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Pile_O_Gunz/",
                    "runs": [
                      {
                        "text": "Pile O Gunz!",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Da_Mek_Shop/",
                    "runs": [
                      {
                        "text": "Da Mek Shop",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Orks/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Field_Command/",
                    "runs": [
                      {
                        "text": "Field Command",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Infantry_Command/",
                    "runs": [
                      {
                        "text": "Infantry Command",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tactica_Control/",
                    "runs": [
                      {
                        "text": "Tactica Control",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mechanized_Command/",
                    "runs": [
                      {
                        "text": "Mechanized Command",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mars_Pattern_Command/",
                    "runs": [
                      {
                        "text": "Mars Pattern Command",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Bolter_Turret_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Heavy Bolter Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Cadre_Headquarters/",
                    "runs": [
                      {
                        "text": "Cadre Headquarters",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Tau/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Tau/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Tau/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tau_Barracks/",
                    "runs": [
                      {
                        "text": "Tau Barracks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Path_to_Enlightenment/",
                    "runs": [
                      {
                        "text": "Path to Enlightenment",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kroot_Shaping_Center/",
                    "runs": [
                      {
                        "text": "Kroot Shaping Center",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Vehicle_Beacon/",
                    "runs": [
                      {
                        "text": "Vehicle Beacon",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kauyon_Command_Post/",
                    "runs": [
                      {
                        "text": "Kauyon Command Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Montka_Command_Post/",
                    "runs": [
                      {
                        "text": "Mont'ka Command Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Coalition_Center/",
                    "runs": [
                      {
                        "text": "Coalition Center",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dormant_Monolith/",
                    "runs": [
                      {
                        "text": "Dormant Monolith",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Obelisk/",
                    "runs": [
                      {
                        "text": "Obelisk",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Necrons/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Necrons/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Summoning_Core/",
                    "runs": [
                      {
                        "text": "Summoning Core",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Forbidden_Archive/",
                    "runs": [
                      {
                        "text": "Forbidden Archive",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Greater_Summoning_Core/",
                    "runs": [
                      {
                        "text": "Greater Summoning Core",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Energy_Core/",
                    "runs": [
                      {
                        "text": "Energy Core",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Gauss_Turret/",
                    "runs": [
                      {
                        "text": "Gauss Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kabal_Fortress/",
                    "runs": [
                      {
                        "text": "Kabal Fortress",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tower_of_Loathing/",
                    "runs": [
                      {
                        "text": "Tower of Loathing",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Slave_Chamber/",
                    "runs": [
                      {
                        "text": "Slave Chamber",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hall_of_Blood/",
                    "runs": [
                      {
                        "text": "Hall of Blood",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Haemonculus_Laboratory/",
                    "runs": [
                      {
                        "text": "Haemonculus' Laboratory",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dark_Foundry/",
                    "runs": [
                      {
                        "text": "Dark Foundry",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wych-Cult_Arena/",
                    "runs": [
                      {
                        "text": "Wych-Cult Arena",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Soul_Cage/",
                    "runs": [
                      {
                        "text": "Soul Cage",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ecclesiarchal_Chapel/",
                    "runs": [
                      {
                        "text": "Ecclesiarchal Chapel",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Adepta_Sororitas_Convent/",
                    "runs": [
                      {
                        "text": "Adepta Sororitas Convent",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Pristine_Sanctuary/",
                    "runs": [
                      {
                        "text": "Pristine Sanctuary",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Manufactorum/",
                    "runs": [
                      {
                        "text": "Manufactorum",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Holy_Reliquary/",
                    "runs": [
                      {
                        "text": "Holy Reliquary",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Shrine_of_the_Living_Saint/",
                    "runs": [
                      {
                        "text": "Shrine of the Living Saint",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Inferno_Turret/",
                    "runs": [
                      {
                        "text": "Inferno Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Purgatus_Mine_Field/",
                    "runs": [
                      {
                        "text": "Purgatus Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "cls": "toccolours",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    }
  ],
  "image": "",
  "alt": "",
  "link": ""
};
