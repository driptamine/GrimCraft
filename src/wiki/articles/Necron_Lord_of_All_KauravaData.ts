// Auto-generated from https://warhammer-guide.ru/wiki/Necron_Lord_of_All_Kaurava.html — do not edit by hand.
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
export const Necron_Lord_of_All_KauravaArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Necron Lord of All Kaurava",
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
                    "text": "Necron Lord of All Kaurava",
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
                    "text": "1800/2",
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
                    "text": "Commander",
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
                    "text": "Morale\n",
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
                    "text": "400/11/50",
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
                    "text": "25",
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
                    "text": "30 (detection 0)",
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
                    "link": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Staff_of_Light",
                    "runs": [
                      {
                        "text": "Staff of Light",
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
                    "link": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Staff_of_Light_.28melee.29",
                    "runs": [
                      {
                        "text": "Staff of Light (melee)",
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
                    "link": "images/SSnecron_lord_icon.jpg",
                    "runs": [
                      {
                        "image": "images/SSnecron_lord_icon.jpg",
                        "alt": "SSnecron lord icon.jpg",
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
                    "text": " 150 \n",
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
                    "text": "Built From\n",
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
                    "text": "Unit Size\n",
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
                    "text": "1\n",
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
                    "text": "Limit\n",
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
                    "text": "1\n",
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
          "block": "p",
          "runs": [
            {
              "text": "This ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dawn_of_War/",
              "runs": [
                {
                  "text": "Dawn of War",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " related article is ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Category_DoW_Pages_Needing_Data/",
              "runs": [
                {
                  "text": "in need of solid data",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ". You can help RelicWiki by ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "Necron_Lord_of_All_Kaurava&action=edit.html",
              "runs": [
                {
                  "text": "adding some",
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
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "This ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dawn_of_War/",
              "runs": [
                {
                  "text": "Dawn of War",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " related article is a ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Category_DoW_Stubs/",
              "runs": [
                {
                  "text": "stub",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ". You can help RelicWiki by ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "Necron_Lord_of_All_Kaurava&action=edit.html",
              "runs": [
                {
                  "text": "expanding it",
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
          "block": "toc",
          "items": [
            {
              "level": 0,
              "n": "1",
              "text": "Necron Lord of All Kaurava",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Necron_Lord_of_All_Kaurava",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Tactics",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Tactics",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "Abilities",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Abilities",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.1",
              "text": "Teleport",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Teleport",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.2",
              "text": "Chronometron",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Chronometron",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.3",
              "text": "Phase Shifter",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Phase_Shifter",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.4",
              "text": "Lightning Field",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Lightning_Field",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.5",
              "text": "Solar Pulse",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Solar_Pulse",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.6",
              "text": "Mass Resurrection",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Mass_Resurrection",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.7",
              "text": "Veil of Darkness",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Veil_of_Darkness",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.8",
              "text": "Nightmare Shroud",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Nightmare_Shroud",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.9",
              "text": "Essence of the Nightbringer",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Essence_of_the_Nightbringer",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.10",
              "text": "Essence of the Deceiver",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Essence_of_the_Deceiver",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.11",
              "text": "Gaze of Flame",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Gaze_of_Flame",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "4",
              "text": "Weapons",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Weapons",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.1",
              "text": "Staff of Light",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Staff_of_Light",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.2",
              "text": "Staff of Light (melee)",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Staff_of_Light_.28melee.29",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "5",
              "text": "Weapon Upgrades",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Weapon_Upgrades",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.1",
              "text": "Skinning Blades",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Skinning_Blades",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.2",
              "text": "Warscythe Blades",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Warscythe_Blades",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.3",
              "text": "Necrontyr Sigils",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Necrontyr_Sigils",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.4",
              "text": "Gauss Flux Arc",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Gauss_Flux_Arc",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "6",
              "text": "Researchable Upgrades",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Researchable_Upgrades",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "7",
              "text": "Wargear",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Wargear",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.1",
              "text": "Skinning Blades",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Skinning_Blades_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.2",
              "text": "Warscythe Blades",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Warscythe_Blades_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.3",
              "text": "Necrontyr Sigils",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Necrontyr_Sigils_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.4",
              "text": "Gauss Flux Arc",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Gauss_Flux_Arc_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.5",
              "text": "Death Mask",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Death_Mask",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.6",
              "text": "Reinforced Body",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Reinforced_Body",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.7",
              "text": "Gaze of Flame",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Gaze_of_Flame_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.8",
              "text": "Improved Necrodermis",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Improved_Necrodermis",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.9",
              "text": "Death Grip",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Death_Grip",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.10",
              "text": "Cloak of the C'tan",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Cloak_of_the_C.27tan",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "8",
              "text": "Dawn of War Single Player Units",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#Dawn_of_War_Single_Player_Units",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "9",
              "text": "The Dawn of War Player's Guide",
              "href": "/settings/wiki/Necron_Lord_of_All_Kaurava/#The_Dawn_of_War_Player.27s_Guide",
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
      "h": "Necron Lord of All Kaurava",
      "level": 2,
      "anchor": "Necron_Lord_of_All_Kaurava",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "The Necron Lord of the arising Necron forces who fought the Eldar a millenia ago in the Kaurava system. His stonghold is based on Kaurava III, in the Coastal Imossa. \n",
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
              "text": "This ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dawn_of_War/",
              "runs": [
                {
                  "text": "Dawn of War",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " related article is ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Category_DoW_Pages_Needing_Tactics/",
              "runs": [
                {
                  "text": "in need of tactics",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ". You can help RelicWiki by ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "Necron_Lord_of_All_Kaurava&action=edit&section=2.html",
              "runs": [
                {
                  "text": "adding some",
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
      "h": "Teleport",
      "level": 3,
      "anchor": "Teleport",
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
                    "text": "Teleport",
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
                    "text": "Hotkey: J\n",
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
                    "link": "images/Teleport.jpg",
                    "runs": [
                      {
                        "image": "images/Teleport.jpg",
                        "alt": "Teleport.jpg",
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
                    "text": "Terrain\n",
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
                    "text": "80\n",
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
                    "text": "None\n",
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
                    "text": "40 s\n",
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
                    "text": "The Necron Lord teleports through intervening terrain directly to the targeted location. At full charge the Necron Lord will have 1 ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "2",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "/",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "3",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " jumps available, requiring 66.7 s to recharge from empty.\n",
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
      "h": "Chronometron",
      "level": 3,
      "anchor": "Chronometron",
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
                    "text": "Chronometron",
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
                    "text": "Hotkey: C\n",
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
                    "link": "images/Necron_chronometron_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Necron_chronometron_icon.jpg",
                        "alt": "Necron chronometron icon.jpg",
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
                    "link": "/settings/wiki/Necron_Lord/#Chronometron_Research",
                    "runs": [
                      {
                        "text": "Chronometron Research",
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
                    "text": "All enemy units\n",
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
                    "text": "20\n",
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
                    "text": "70 s\n",
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
                    "text": "Time around the Necron Lord slows down and enemy units within the area of effect get their movement speed reduced by 40%. The ability only lasts for 15 s, but refreshes every 2 s until 18 s, potentially extending the ability to 33 s long for a single target or slowing new units that fall within the area of effect during the refresh.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Also has a passive movement speed reduction of 10% to all enemy units within a radius of 5 from the Necron Lord.\n",
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
      "h": "Phase Shifter",
      "level": 3,
      "anchor": "Phase_Shifter",
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
                    "text": "Phase Shifter",
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
                    "text": "Hotkey: H\n",
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
                    "link": "images/Necron_phase_shifter_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Necron_phase_shifter_icon.jpg",
                        "alt": "Necron phase shifter icon.jpg",
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
                    "link": "/settings/wiki/Necron_Lord/#Phase_Shifter_Research",
                    "runs": [
                      {
                        "text": "Phase Shifter Research",
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
                    "text": "All allied Necron units\n",
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
                    "text": "10\n",
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
                    "text": "90 s\n",
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
                    "text": "The Necron Lord and any friendly troops within the area of effect have their morale restored, become invulnerable, gain 10 health per second, and cannot use their weapons for 15 s. The health regeneration effect is tripled by the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Lord/#Phylactery",
                    "runs": [
                      {
                        "text": "Phylactery",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " for the Necron Lord only. Refreshes every second and does not persist, affecting only the units within the area of effect during that second.\n",
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
      "h": "Lightning Field",
      "level": 3,
      "anchor": "Lightning_Field",
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
                    "text": "Lightning Field",
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
                    "text": "Hotkey: L\n",
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
                    "link": "images/Necron_lightning_field_icon.jpg.jpg",
                    "runs": [
                      {
                        "image": "images/Necron_lightning_field_icon.jpg.jpg",
                        "alt": "Necron lightning field icon.jpg.jpg",
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
                    "link": "/settings/wiki/Necron_Lord/#Lightning_Field_Research",
                    "runs": [
                      {
                        "text": "Lightning Field Research",
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
                    "text": "Anything\n",
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
                    "text": "6\n",
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
                    "text": "5\n",
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
                    "text": "Variable\n",
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
                    "text": "90% of the damage taken by the Necron Lord in melee is reflected back and also inflicted on the enemy. All of the damage taken by the Lord in melee adds by the ability's charge along with 45% of the damage inflicted by the Necron Lord in melee. The ability can store a maximum of 900 points of damage. The stored energy can be unleashed as a storm of lighting in a circle around the target when the ability has reached at least a 20% charge. When cast, the ability deals a flat 315 damage to all enemy targets at maximum charge, although damage scales smoothly as the ability charges up.\n",
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
      "h": "Solar Pulse",
      "level": 3,
      "anchor": "Solar_Pulse",
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
                    "text": "Solar Pulse",
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
                    "text": "Hotkey: P\n",
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
                    "link": "images/Necron_solar_pulse_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Necron_solar_pulse_icon.jpg",
                        "alt": "Necron solar pulse icon.jpg",
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
                    "link": "/settings/wiki/Necron_Lord/#Solar_Pulse_Research",
                    "runs": [
                      {
                        "text": "Solar Pulse Research",
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
                    "text": "Target ground\n",
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
                    "text": "15\n",
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
                    "text": "20\n",
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
                    "text": "70 s\n",
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
                    "text": "Creates a Solar Pulse on the targeted location that blinds the enemy and guides the Necrons. Enemy units within its area of effect have their sight range and detection range reduced to 10% and are unable to use ranged weapons. Also, the Solar Pulse has a sight and detection radius of 15. The Solar Pulse lasts for 20 seconds.\n",
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
      "h": "Mass Resurrection",
      "level": 3,
      "anchor": "Mass_Resurrection",
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
                    "text": "Resurrection Orb",
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
                    "text": "Hotkey: M\n",
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
                    "link": "images/Necron_mass_resurrection_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Necron_mass_resurrection_icon.jpg",
                        "alt": "Necron mass resurrection icon.jpg",
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
                    "link": "/settings/wiki/Necron_Lord/#Resurrection_Orb_Research",
                    "runs": [
                      {
                        "text": "Resurrection Orb Research",
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
                    "text": "Friendly destroyed ",
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
                    "text": ", ",
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
                    "text": ", ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wraith/",
                    "runs": [
                      {
                        "text": "Wraiths",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ", and ",
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
                    "text": "26\n",
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
                    "text": "180 s\n",
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
                    "text": "All destroyed ",
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
                    "text": ", ",
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
                    "text": ", ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wraith/",
                    "runs": [
                      {
                        "text": "Wraiths",
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
                    "text": " within the area of effect reassemble and stand up with 30% of their original hit points. This ability also provides a passive 25% bonus to the chance Necron troops within a radius of 25 will get up on their own when slain. The Necron Lord cannot resurrect troops beyond the current maximum squad population plus 4 when casting this ability.\n",
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
      "h": "Veil of Darkness",
      "level": 3,
      "anchor": "Veil_of_Darkness",
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
                    "text": "Veil of Darkness",
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
                    "link": "/settings/wiki/Necron_Lord/#Veil_of_Darkness_Research",
                    "runs": [
                      {
                        "text": "Veil of Darkness Research",
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
                    "text": "All friendly units and buildings\n",
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
                    "text": "20\n",
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
                    "text": "A permanent passive ability that makes the Necron Lord and friendly units and buildings within the area of effect ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dawn_of_War_Infiltration/",
                    "runs": [
                      {
                        "text": "infiltrated",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " as long as the Necron Lord has at least 50% health.\n",
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
      "h": "Nightmare Shroud",
      "level": 3,
      "anchor": "Nightmare_Shroud",
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
                    "text": "Nightmare Shroud",
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
                    "link": "images/Necron_nightmare_shroud_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Necron_nightmare_shroud_icon.jpg",
                        "alt": "Necron nightmare shroud icon.jpg",
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
                    "link": "/settings/wiki/Necron_Lord/#Nightmare_Shroud_Research",
                    "runs": [
                      {
                        "text": "Nightmare Shroud Research",
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
                    "text": "All enemy Infantry, Heavy Infantry, Commanders, and Daemon Medium\n",
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
                    "text": "15\n",
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
                    "text": "95 s\n",
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
                    "text": "All nearby enemy infantry are forced to flee the Necron Lord for 8 s and any morale-vulnerable troops take 100,000 morale damage.\n",
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
      "h": "Essence of the Nightbringer",
      "level": 3,
      "anchor": "Essence_of_the_Nightbringer",
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
                    "text": "Essence of the Nightbringer",
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
                    "text": "Hotkey: S\n",
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
                    "link": "images/Necron_nightbringer_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Necron_nightbringer_icon.jpg",
                        "alt": "Necron nightbringer icon.jpg",
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
                    "link": "/settings/wiki/Necron_Lord/#Essence_of_the_C.27tan_Gods",
                    "runs": [
                      {
                        "text": "Essence of the C'tan Gods",
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
                    "text": "300 s (shared with ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Lord/#Essence_of_the_Deceiver",
                    "runs": [
                      {
                        "text": "Deceiver",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ")\n",
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
                    "text": "The Necron Lord channels the essence of the unstoppable C'tan god the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Essence_of_the_Nightbringer/",
                    "runs": [
                      {
                        "text": "Nightbringer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ". After 60 seconds the Nightbringer manifestation disappears and the Necron Lord is returned. If the Necron Lord has ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Lord/#Lightning_Field",
                    "runs": [
                      {
                        "text": "Lightning Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " researched, any charge on the ability will be lost.\n",
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
      "h": "Essence of the Deceiver",
      "level": 3,
      "anchor": "Essence_of_the_Deceiver",
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
                    "text": "Essence of the Deceiver",
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
                    "text": "Hotkey: D\n",
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
                    "link": "images/Necron_deceiver_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Necron_deceiver_icon.jpg",
                        "alt": "Necron deceiver icon.jpg",
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
                    "link": "/settings/wiki/Necron_Lord/#Essence_of_the_C.27tan_Gods",
                    "runs": [
                      {
                        "text": "Essence of the C'tan Gods",
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
                    "text": "300 s (shared with ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Lord/#Essence_of_the_Nightbringer",
                    "runs": [
                      {
                        "text": "Nightbringer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ")\n",
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
                    "text": "The Necron Lord channels the essence of the shadowy C'tan god the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Essence_of_the_Deceiver/",
                    "runs": [
                      {
                        "text": "Deceiver",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ". After 60 seconds the Deceiver manifestation disappears and the Necron Lord is returned. If the Necron Lord has ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Lord/#Lightning_Field",
                    "runs": [
                      {
                        "text": "Lightning Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " researched, any charge on the ability will be lost.\n",
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
      "h": "Gaze of Flame",
      "level": 3,
      "anchor": "Gaze_of_Flame",
      "blocks": [],
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
      "h": "Staff of Light",
      "level": 3,
      "anchor": "Staff_of_Light",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Staff of Light (melee)",
      "level": 3,
      "anchor": "Staff_of_Light_.28melee.29",
      "blocks": [],
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
      "h": "Skinning Blades",
      "level": 3,
      "anchor": "Skinning_Blades",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Warscythe Blades",
      "level": 3,
      "anchor": "Warscythe_Blades",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Necrontyr Sigils",
      "level": 3,
      "anchor": "Necrontyr_Sigils",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Gauss Flux Arc",
      "level": 3,
      "anchor": "Gauss_Flux_Arc",
      "blocks": [],
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
      "h": "Wargear",
      "level": 2,
      "anchor": "Wargear",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Skinning Blades",
      "level": 3,
      "anchor": "Skinning_Blades_2",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Warscythe Blades",
      "level": 3,
      "anchor": "Warscythe_Blades_2",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Necrontyr Sigils",
      "level": 3,
      "anchor": "Necrontyr_Sigils_2",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Gauss Flux Arc",
      "level": 3,
      "anchor": "Gauss_Flux_Arc_2",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Death Mask",
      "level": 3,
      "anchor": "Death_Mask",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Reinforced Body",
      "level": 3,
      "anchor": "Reinforced_Body",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Gaze of Flame",
      "level": 3,
      "anchor": "Gaze_of_Flame_2",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Improved Necrodermis",
      "level": 3,
      "anchor": "Improved_Necrodermis",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Death Grip",
      "level": 3,
      "anchor": "Death_Grip",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Cloak of the C'tan",
      "level": 3,
      "anchor": "Cloak_of_the_C.27tan",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Dawn of War Single Player Units",
      "level": 2,
      "anchor": "Dawn_of_War_Single_Player_Units",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dawn_of_War_Campaign/",
                    "runs": [
                      {
                        "text": "Dawn of War Single Player Units",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 2,
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
                    "link": "/settings/wiki/Dawn_of_War/",
                    "runs": [
                      {
                        "text": "Dawn of War",
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
                    "link": "/settings/wiki/Dawn_of_War_Winter_Assault/",
                    "runs": [
                      {
                        "text": "Winter Assault",
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
                    "link": "/settings/wiki/Dawn_of_War_Dark_Crusade/",
                    "runs": [
                      {
                        "text": "Dark Crusade",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 2,
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
                    "link": "/settings/wiki/Dawn_of_War_Soulstorm/",
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
                  }
                ],
                "colspan": 2,
                "bg": "#ccddcc",
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
        },
        {
          "block": "table",
          "rows": [
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Gabriel_Angelos/",
                    "runs": [
                      {
                        "text": "Gabriel Angelos",
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
                    "link": "/settings/wiki/Isador_Akios/",
                    "runs": [
                      {
                        "text": "Isador Akios",
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
                    "link": "/settings/wiki/Mordecai_Toth/",
                    "runs": [
                      {
                        "text": "Mordecai Toth",
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
                    "link": "/settings/wiki/Carus_Brom/",
                    "runs": [
                      {
                        "text": "Carus Brom",
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
                    "link": "/settings/wiki/Orkamungus/",
                    "runs": [
                      {
                        "text": "Orkamungus",
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
                    "link": "/settings/wiki/Macha/",
                    "runs": [
                      {
                        "text": "Macha",
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
                    "link": "/settings/wiki/Bale/",
                    "runs": [
                      {
                        "text": "Bale",
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
                    "link": "/settings/wiki/Sindri_Myr/",
                    "runs": [
                      {
                        "text": "Sindri Myr",
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
                    "link": "/settings/wiki/Chaplain_Varnus/",
                    "runs": [
                      {
                        "text": "Chaplain Varnus",
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
                    "link": "/settings/wiki/General_Sturnn/",
                    "runs": [
                      {
                        "text": "General Sturnn",
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
                    "link": "Warlord_Gorgutz_Ead_Unter_(Winter_Assault).html",
                    "runs": [
                      {
                        "text": "Warlord Gorgutz",
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
                    "link": "Farseer_Taldeer_(Winter_Assault)&action=edit&redlink=1.html",
                    "runs": [
                      {
                        "text": "Farseer Taldeer",
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
                    "link": "/settings/wiki/Lord_Crull/",
                    "runs": [
                      {
                        "text": "Lord Crull",
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
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "/settings/wiki/Davian_Thule/",
                    "runs": [
                      {
                        "text": "Davian Thule",
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
                    "link": "/settings/wiki/Eliphas_the_Inheritor/",
                    "runs": [
                      {
                        "text": "Eliphas the Inheritor",
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
                    "link": "/settings/wiki/Farseer_Taldeer/",
                    "runs": [
                      {
                        "text": "Farseer Taldeer",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/",
                    "runs": [
                      {
                        "text": "Warlord Gorgutz",
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
                    "link": "/settings/wiki/Lukas_Alexander/",
                    "runs": [
                      {
                        "text": "Lukas Alexander",
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
                    "link": "/settings/wiki/Shaso_Kais/",
                    "runs": [
                      {
                        "text": "Shas'o Kais",
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
                    "link": "/settings/wiki/Kronus_Necron_Lord/",
                    "runs": [
                      {
                        "text": "Kronus Necron Lord",
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
                    "link": "/settings/wiki/Indrick_Boreale/",
                    "runs": [
                      {
                        "text": "Indrick Boreale",
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
                    "link": "/settings/wiki/Firaeveus_Carron/",
                    "runs": [
                      {
                        "text": "Firaeveus Carron",
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
                    "link": "/settings/wiki/Farseer_Caerys/",
                    "runs": [
                      {
                        "text": "Farseer Caerys",
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
                    "link": "Warboss_Gorgutz&action=edit&redlink=1.html",
                    "runs": [
                      {
                        "text": "Warboss Gorgutz",
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
                    "link": "/settings/wiki/General_Vance_Stubbs/",
                    "runs": [
                      {
                        "text": "General Vance Stubbs",
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
                    "link": "/settings/wiki/Commander_OresKa/",
                    "runs": [
                      {
                        "text": "Commander Or'es'Ka",
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
                    "text": "Necron Lord of All Kaurava",
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
                    "link": "/settings/wiki/Archon_Tahril/",
                    "runs": [
                      {
                        "text": "Archon Tahril",
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
                    "link": "/settings/wiki/Canoness_Selena_Agna/",
                    "runs": [
                      {
                        "text": "Canoness Selena Agna",
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
