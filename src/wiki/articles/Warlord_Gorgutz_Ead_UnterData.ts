// Auto-generated from https://warhammer-guide.ru/wiki/Warlord_Gorgutz_Ead_Unter.html — do not edit by hand.
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
export const Warlord_Gorgutz_Ead_UnterArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Warlord Gorgutz Ead Unter",
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
                    "text": "Warlord Gorgutz 'Ead 'Unter",
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
                    "link": "images/Warlord_gorgutz_dc.jpg",
                    "runs": [
                      {
                        "image": "images/Warlord_gorgutz_dc.jpg",
                        "alt": "Warlord gorgutz dc.jpg",
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
                    "link": "/settings/wiki/Dark_Crusade/",
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
                    "text": "2000/2",
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
                    "text": "500/12/150",
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
                    "text": "+200/+3",
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
                    "text": "35",
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
                    "text": "25 (detection 25)",
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
                    "text": "Attachable\n",
                    "image": "",
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
                    "text": "Yes",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Shoota",
                    "runs": [
                      {
                        "text": "Shoota",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Powerclaw",
                    "runs": [
                      {
                        "text": "Powerclaw",
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
                    "link": "images/Warboss_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Warboss_icon.jpg",
                        "alt": "Warboss icon.jpg",
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
                    "text": "W\n",
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
                    "text": " 200 ",
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
                    "text": " 75    ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "images/Resource_orksquadcap.gif",
                    "runs": [
                      {
                        "image": "images/Resource_orksquadcap.gif",
                        "alt": "Resource orksquadcap.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 0\n",
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
                    "link": "/settings/wiki/Ork_Settlement/",
                    "runs": [
                      {
                        "text": "Ork Settlement",
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
                    "link": "/settings/wiki/Ork_Settlement/#Orky_Fort",
                    "runs": [
                      {
                        "text": "Orky Fort",
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
          "block": "toc",
          "items": [
            {
              "level": 0,
              "n": "1",
              "text": "Warlord Gorgutz 'Ead 'Unter",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Warlord_Gorgutz_.27Ead_.27Unter",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "1.1",
              "text": "Personality",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Personality",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Tactics",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Tactics",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "Abilities",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Abilities",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.1",
              "text": "Power of Waaagh!",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Power_of_Waaagh.21",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.2",
              "text": "Waaagh!",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Waaagh.21",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "4",
              "text": "Weapons",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Weapons",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.1",
              "text": "Shoota",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Shoota",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.2",
              "text": "Powerclaw",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Powerclaw",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "5",
              "text": "Weapon Upgrades",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Weapon_Upgrades",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.1",
              "text": "Kustom Shoota",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Kustom_Shoota",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.2",
              "text": "Mega Blasta",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Blasta",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.3",
              "text": "Bigga Claw",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Bigga_Claw",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.4",
              "text": "Mega Claw",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Claw",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.5",
              "text": "Big Horns",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Big_Horns",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "5.6",
              "text": "Red Iron Gob",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Red_Iron_Gob",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "6",
              "text": "Researchable Upgrades",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Researchable_Upgrades",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "6.1",
              "text": "Tougher Bosses Research",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Tougher_Bosses_Research",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "6.2",
              "text": "Even Tougher Bosses Research",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Even_Tougher_Bosses_Research",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "7",
              "text": "Wargear",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Wargear",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.1",
              "text": "Bigga Claw",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Bigga_Claw_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.2",
              "text": "Mega Claw",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Claw_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.3",
              "text": "Kustom Shoota",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Kustom_Shoota_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.4",
              "text": "Mega Blasta",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Blasta_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.5",
              "text": "Big Horns",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Big_Horns_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.6",
              "text": "Red Iron Gob",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Red_Iron_Gob_2",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.7",
              "text": "Mega 'Eavy Armor",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_.27Eavy_Armor",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.8",
              "text": "Fasta Legz",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Fasta_Legz",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.9",
              "text": "Skullz",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Skullz",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "7.10",
              "text": "Boss Pole",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Boss_Pole",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "8",
              "text": "Dawn of War Single Player Units",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Dawn_of_War_Single_Player_Units",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "9",
              "text": "The Dawn of War Player's Guide",
              "href": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#The_Dawn_of_War_Player.27s_Guide",
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
      "h": "Warlord Gorgutz 'Ead 'Unter",
      "level": 2,
      "anchor": "Warlord_Gorgutz_.27Ead_.27Unter",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "\"Oi humies, you're in Ork lands now. 'Ope you ain't too attached to yer 'eads.\"",
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
              "text": "\"Warlord Gorgutz 'Ead 'Unter iz da biggest and baddest Ork on Kronus, which makes him da biggest and baddest feller on da whole planet. He'z turnin' those stupid feral gitz into real Orks an' leadin' 'em in a massive Waaagh! Dem humies, spikey boyz, puny Eldar, grey skinz, and Shiny Boyz are all gonna get stomped and smashed but good!\"\n",
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
      "h": "Personality",
      "level": 3,
      "anchor": "Personality",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Gorgutz is an aspiring, ambitious Ork Warboss. Ever since Winter Assault, Gorgutz has tried again and again to overrun planets with his Waaagh, but is always driven off by one of the more \"civilized\" factions in the \"canon\" ending. Yet he always manages to come back an Ork hero. Should he actually succeed in a noncanon ending, he starts to set up his new Ork Empire. Another thing that never changes is his hobby of collecting the heads of his enemies.\n",
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
              "text": "Like all other orks, Gorgutz is very arrogant towards... well... anyone. He NEVER admits defeat, and he seems to think that he is infinitely smarter than his men. (Indeed, this occasionally proves to be true.) The irony, however, is that he also hates it when his men flatter him. At the same time, if the enemy commander attempts to reason or taunt him, Gorgutz shows that he is also quite witty, managing to create a comeback to the far more \"intelligent\" commander.\n",
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
              "text": "However, behind his outrageous gloating and pompous claims, Gorgutz is actually a bit of a coward. Whenever his enemies - be it the 1st Kronus Liberators, the Alpha Legion, or a Tau Strike Force - close in on him, he chooses to run away instead of fighting to the end.\n",
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
              "text": "Never get the ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Big_Horns_Wargear",
              "runs": [
                {
                  "text": "Big Horns",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " Wargear. This ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Big_Horns",
              "runs": [
                {
                  "text": "extra melee weapon",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " has an area of effect and friendly fire, so when attacking enemy troops in a crowd of Boyz and Nobz this weapon will do as much damage to the your own troops as the enemy's. The ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Red_Iron_Gob",
              "runs": [
                {
                  "text": "Red Iron Gob",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " has no such problems though since it doesn't have an AOE, so feel free to pick up that ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Red_Iron_Gob_Wargear",
              "runs": [
                {
                  "text": "wargear",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ". The ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Skullz",
              "runs": [
                {
                  "text": "Skullz",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " correctly filters out friendly troops to avoid harming your army.\n",
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
              "text": "The ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Blasta_Wargear",
              "runs": [
                {
                  "text": "Mega Blasta Wargear",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " should probably be avoided for the same reason as the Big Horns. Just like the regular ",
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
              "text": "'s ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Big_Mek/#Mega_Blasta",
              "runs": [
                {
                  "text": "Mega Blasta",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ", it does friendly fire in an area of effect so it will also shred your own troops.\n",
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
              "text": "Be careful not to let Gorgutz die before you can get an ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Ork_Settlement/#Orky_Fort",
              "runs": [
                {
                  "text": "Orky Fort",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " completed. Unlike the other campaign heroes, Gorgutz is based on the Tier 3 Ork hero. Losing him early could lead to his forced absence through much of the remaining fight until you can tech high enough to replace him.\n",
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
              "text": "To increase both survivability and combat effectiveness attach Gorgutz to a Nobz Squad. In most campaigns missions (outside strongholds) this assures a succesful conquest or defense.\n",
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
      "h": "Power of Waaagh!",
      "level": 3,
      "anchor": "Power_of_Waaagh.21",
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
                    "text": "Power of Waaagh!",
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
                    "text": "Hotkey: W\n",
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
                    "link": "images/Power_of_waaagh_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Power_of_waaagh_icon.jpg",
                        "alt": "Power of waaagh icon.jpg",
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
                    "text": "Friendly Infantry and Heavy Infantry\n",
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
                    "text": "120 s\n",
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
                    "text": "The Warboss calls upon the power of the Waaagh with the following effects:\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Affected units are immune to morale damage\n",
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
                    "text": "Affected units have their weapon damage increased by 15%\n",
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
                    "text": "Affected units have their speed increased by 33%\n",
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
                  },
                  {
                    "text": "The effects lasts for 20 seconds.\n",
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
      "h": "Waaagh!",
      "level": 3,
      "anchor": "Waaagh.21",
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
                    "text": "Waaagh!",
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
                    "text": "Variable\n",
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
                    "text": "Variable\n",
                    "image": "",
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
                    "text": "Orks get braver and stronger the more of them there are. This ability confers health bonuses, ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dawn_of_War_Morale/",
                    "runs": [
                      {
                        "text": "morale",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " bonuses, and damage bonuses to ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dawn_of_War_Squad_System/",
                    "runs": [
                      {
                        "text": "squads",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ". See the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Orky_Mob_Bonus/",
                    "runs": [
                      {
                        "text": "Orky Mob Bonus!",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " page for a full description of how the ability works.\n",
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
      "h": "Shoota",
      "level": 3,
      "anchor": "Shoota",
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
                    "text": "Shoota",
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
                    "text": "65%\n",
                    "image": "",
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
                    "text": "0.7 s\n",
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
                    "text": "Initial DPS:\n",
                    "image": "",
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
                    "text": "80.3\n",
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
                    "text": "111.2\n",
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
                    "text": "77.2\n",
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
                    "text": "120.4\n",
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
                    "text": "77.2\n",
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
                    "text": "57.9\n",
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
                    "text": "44.8\n",
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
                    "text": "21.6\n",
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
                    "text": "NA\n",
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
                    "text": "89.5\n",
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
                    "text": "15.4\n",
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
                    "text": "77.2\n",
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
                    "text": "27.8\n",
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
                    "text": "4\n",
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
                    "text": "150\n",
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
                    "text": "182.9\n",
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
                    "text": "3.5\n",
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
      "h": "Powerclaw",
      "level": 3,
      "anchor": "Powerclaw",
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
                    "text": "Powerclaw",
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
                    "text": "melee\n",
                    "image": "",
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
                    "text": "100%\n",
                    "image": "",
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
                    "text": "Initial DPS:\n",
                    "image": "",
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
                    "text": "72.8\n",
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
                    "text": "154.0\n",
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
                    "text": "141.4\n",
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
                    "text": "166.4\n",
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
                    "text": "142.6\n",
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
                    "text": "70.0\n",
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
                    "text": "59.4\n",
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
                    "text": "48.8\n",
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
                    "text": "136.5\n",
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
                    "text": "NA\n",
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
                    "text": "120.0\n",
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
                    "text": "25.0\n",
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
                    "text": "6.0\n",
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
                    "text": "182.0\n",
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
                    "text": "136.5\n",
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
                    "text": "40\n",
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
                    "text": "80\n",
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
                    "text": "180\n",
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
                    "text": "220\n",
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
                    "text": "5\n",
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
      "h": "Kustom Shoota",
      "level": 3,
      "anchor": "Kustom_Shoota",
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
                    "text": "Kustom Shoota",
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
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Kustom_Shoota_2",
                    "runs": [
                      {
                        "text": "Kustom Shoota",
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
                    "text": "35\n",
                    "image": "",
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
                    "text": "65%\n",
                    "image": "",
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
                    "text": "0.3 s\n",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Kustom_Shoota_2",
                    "runs": [
                      {
                        "text": "Kustom Shoota",
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
                    "link": "images/Ork_BigShootaWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_BigShootaWargear_icon.jpg",
                        "alt": "Ork BigShootaWargear icon.jpg",
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
                    "text": "Initial DPS:\n",
                    "image": "",
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
                    "text": "99.8\n",
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
                    "text": "138.2\n",
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
                    "text": "96.0\n",
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
                    "text": "149.7\n",
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
                    "text": "96.0\n",
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
                    "text": "72.0\n",
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
                    "text": "55.7\n",
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
                    "text": "28.2\n",
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
                    "text": "NA\n",
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
                    "text": "111.3\n",
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
                    "text": "19.2\n",
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
                    "text": "144.0\n",
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
                    "text": "34.6\n",
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
                    "text": "13\n",
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
                    "text": "12\n",
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
                    "text": "80.2\n",
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
                    "text": "97.1\n",
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
      "h": "Mega Blasta",
      "level": 3,
      "anchor": "Mega_Blasta",
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
                    "text": "Mega Blasta",
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
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Blasta_2",
                    "runs": [
                      {
                        "text": "Mega Blasta",
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
                    "text": "60%\n",
                    "image": "",
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
                    "text": "2 s\n",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Blasta_2",
                    "runs": [
                      {
                        "text": "Mega Blasta",
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
                    "text": "This weapon does friendly fire.\n",
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
                    "link": "images/Ork_MegaBlastaWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_MegaBlastaWargear_icon.jpg",
                        "alt": "Ork MegaBlastaWargear icon.jpg",
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
                    "text": "Initial DPS:\n",
                    "image": "",
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
                    "text": "22.1\n",
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
                    "text": "42.8\n",
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
                    "text": "34.5\n",
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
                    "text": "31.5\n",
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
                    "text": "24.2\n",
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
                    "text": "25.9\n",
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
                    "text": "20.0\n",
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
                    "text": "10.1\n",
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
                    "text": "3.0\n",
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
                    "text": "NA\n",
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
                    "text": "17.3\n",
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
                    "text": "6.9\n",
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
                    "text": "3.0\n",
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
                    "text": "24.2\n",
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
                    "text": "17.3\n",
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
                    "text": "4.5\n",
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
                    "text": "30\n",
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
                    "text": "200\n",
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
                    "text": "260\n",
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
                    "text": "10\n",
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
      "h": "Bigga Claw",
      "level": 3,
      "anchor": "Bigga_Claw",
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
                    "text": "Bigga Claw",
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
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Bigga_Claw_2",
                    "runs": [
                      {
                        "text": "Bigga Claw",
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
                    "text": "100%\n",
                    "image": "",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Bigga_Claw_2",
                    "runs": [
                      {
                        "text": "Bigga Claw",
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
                    "link": "images/Ork_BiggaClawWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_BiggaClawWargear_icon.jpg",
                        "alt": "Ork BiggaClawWargear icon.jpg",
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
                    "text": "Initial DPS:\n",
                    "image": "",
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
                    "text": "109.2\n",
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
                    "text": "231.0\n",
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
                    "text": "212.1\n",
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
                    "text": "249.6\n",
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
                    "text": "213.9\n",
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
                    "text": "105.0\n",
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
                    "text": "89.1\n",
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
                    "text": "74.7\n",
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
                    "text": "204.9\n",
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
                    "text": "NA\n",
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
                    "text": "180.0\n",
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
                    "text": "37.5\n",
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
                    "text": "41.7\n",
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
                    "text": "273.0\n",
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
                    "text": "204.9\n",
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
                    "text": "40\n",
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
                    "text": "80\n",
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
                    "text": "280\n",
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
                    "text": "320\n",
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
                    "text": "10\n",
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
      "h": "Mega Claw",
      "level": 3,
      "anchor": "Mega_Claw",
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
                    "text": "Mega Claw",
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
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Claw_2",
                    "runs": [
                      {
                        "text": "Mega Claw",
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
                    "text": "100%\n",
                    "image": "",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Claw_2",
                    "runs": [
                      {
                        "text": "Mega Claw",
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
                    "link": "images/MegaClawWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/MegaClawWargear_icon.jpg",
                        "alt": "MegaClawWargear icon.jpg",
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
                    "text": "Initial DPS:\n",
                    "image": "",
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
                    "text": "131.1\n",
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
                    "text": "277.2\n",
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
                    "text": "254.5\n",
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
                    "text": "299.5\n",
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
                    "text": "256.7\n",
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
                    "text": "126.0\n",
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
                    "text": "106.9\n",
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
                    "text": "89.6\n",
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
                    "text": "245.7\n",
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
                    "text": "NA\n",
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
                    "text": "216.0\n",
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
                    "text": "44.9\n",
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
                    "text": "49.9\n",
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
                    "text": "327.6\n",
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
                    "text": "245.7\n",
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
                    "text": "40\n",
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
                    "text": "80\n",
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
                    "text": "320\n",
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
                    "text": "400\n",
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
                    "text": "10\n",
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
      "h": "Big Horns",
      "level": 3,
      "anchor": "Big_Horns",
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
                    "text": "Big Horns",
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
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Big_Horns_2",
                    "runs": [
                      {
                        "text": "Big Horns",
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
                    "text": "100%\n",
                    "image": "",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Big_Horns_2",
                    "runs": [
                      {
                        "text": "Big Horns",
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
                    "text": "This weapon does friendly fire.\n",
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
                    "link": "images/Ork_BigHornsWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_BigHornsWargear_icon.jpg",
                        "alt": "Ork BigHornsWargear icon.jpg",
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
                    "text": "Initial DPS:\n",
                    "image": "",
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
                    "text": "40.5\n",
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
                    "text": "81.0\n",
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
                    "text": "67.5\n",
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
                    "text": "60.8\n",
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
                    "text": "47.3\n",
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
                    "text": "40.5\n",
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
                    "text": "27.0\n",
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
                    "text": "10.0\n",
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
                    "text": "NA\n",
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
                    "text": "40.5\n",
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
                    "text": "27.0\n",
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
                    "text": "10.0\n",
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
                    "text": "47.3\n",
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
                    "text": "13.5\n",
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
                    "text": "15\n",
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
                    "text": "30\n",
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
                    "text": "120\n",
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
                    "text": "150\n",
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
                    "text": "10\n",
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
      "h": "Red Iron Gob",
      "level": 3,
      "anchor": "Red_Iron_Gob",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "This weapon has a reload time of 0 s, so calculating proper DPS values is impossible. Instead, the piercing percentages against the armor types are listed so that relative damage between armor types can at least be determined.\n",
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
                    "text": "Red Iron Gob",
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
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Red_Iron_Gob_2",
                    "runs": [
                      {
                        "text": "Red Iron Gob",
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
                    "text": "100%\n",
                    "image": "",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Red_Iron_Gob_2",
                    "runs": [
                      {
                        "text": "Red Iron Gob",
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
                    "link": "images/Ork_RedGobWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_RedGobWargear_icon.jpg",
                        "alt": "Ork RedGobWargear icon.jpg",
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
                    "text": "Initial DPS:\n",
                    "image": "",
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
                "bg": "white",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "60\n",
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
                    "text": "50\n",
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
                    "text": "45\n",
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
                    "text": "35\n",
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
                    "text": "30\n",
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
                    "text": "30\n",
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
                    "text": "20\n",
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
                    "text": "0\n",
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
                    "text": "NA\n",
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
                    "text": "30\n",
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
                    "text": "20\n",
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
                    "text": "35\n",
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
                    "text": "10\n",
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
                    "text": "20\n",
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
                    "text": "120\n",
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
                    "text": "150\n",
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
                    "text": "10\n",
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
      "h": "Tougher Bosses Research",
      "level": 3,
      "anchor": "Tougher_Bosses_Research",
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
                    "text": "Tougher Bosses Research",
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
                    "text": "Hotkey: G\n",
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
                    "link": "images/Tougher_bosses_research_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Tougher_bosses_research_icon.jpg",
                        "alt": "Tougher bosses research icon.jpg",
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
                    "text": "45 s\n",
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
                    "link": "images/Resource_orksquadcap.gif",
                    "runs": [
                      {
                        "image": "images/Resource_orksquadcap.gif",
                        "alt": "Resource orksquadcap.gif",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " 50\n",
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
                    "text": "</b>\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlord Gorgutz 'Ead 'Unter's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " hitpoints are increased by 400\n",
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
                    "text": "The ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek's",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " hitpoints are increased by 300\n",
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
                    "link": "/settings/wiki/Mega_Armoured_Nobz/",
                    "runs": [
                      {
                        "text": "Mega Armoured Nobz'",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " hitpoints are increased by 200\n",
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
                    "link": "/settings/wiki/Nob_Leader/",
                    "runs": [
                      {
                        "text": "Nob Leaders",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": "' and ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Stormboy_Nob_Leader/",
                    "runs": [
                      {
                        "text": "Stormboy Nob Leaders",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": "' hitpoints are increased by 100\n",
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
                    "text": "The ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek's",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/#Powerclaw",
                    "runs": [
                      {
                        "text": "Powerclaw",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " damage is increased by 15%\n",
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
                    "text": "Warlord Gorgutz 'Ead 'Unter's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health regeneration rate is increased by 3 HP/s\n",
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
                    "text": "The ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek's",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " health regeneration rate is increased by 0.5 HP/s\n",
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
                    "text": "The cooldown time on the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek's",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " abilities are decreased by 10%\n",
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
      "h": "Even Tougher Bosses Research",
      "level": 3,
      "anchor": "Even_Tougher_Bosses_Research",
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
                    "text": "Even Tougher Bosses Research",
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
                    "text": "Hotkey: G\n",
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
                    "link": "images/Tougher_bosses_research_2_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Tougher_bosses_research_2_icon.jpg",
                        "alt": "Tougher bosses research 2 icon.jpg",
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
                    "text": "45 s\n",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Tougher_Bosses_Research",
                    "runs": [
                      {
                        "text": "Tougher Bosses Research",
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
                    "link": "/settings/wiki/Settlement/#Orky_Fort",
                    "runs": [
                      {
                        "text": "Orky Fort",
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
                    "text": "</b>\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlord Gorgutz 'Ead 'Unter's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " hitpoints are increased by 400\n",
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
                    "text": "The ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek's",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " hitpoints are increased by a further 300\n",
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
                    "link": "/settings/wiki/Mega_Armoured_Nobz/",
                    "runs": [
                      {
                        "text": "Mega Armoured Nobz'",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " hitpoints are increased by a further 200\n",
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
                    "link": "/settings/wiki/Nob_Leader/",
                    "runs": [
                      {
                        "text": "Nob Leaders",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": "' and ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Stormboy_Nob_Leader/",
                    "runs": [
                      {
                        "text": "Stormboy Nob Leaders",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": "' hitpoints are increased by a further 100\n",
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
                    "text": "The ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek's",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/#Powerclaw",
                    "runs": [
                      {
                        "text": "Powerclaw",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " damage is increased by a further 20% (38% total)\n",
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
                    "text": "Warlord Gorgutz 'Ead 'Unter's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health regeneration rate is increased by a further 3 HP/s\n",
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
                    "text": "The ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek's",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " health regeneration rate is increased by a further 0.5 HP/s\n",
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
                    "text": "The cooldown time on the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek's",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " abilities are decreased by a further 10% (19% total)\n",
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
      "h": "Wargear",
      "level": 2,
      "anchor": "Wargear",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Bigga Claw",
      "level": 3,
      "anchor": "Bigga_Claw_2",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Bigga Claw",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_BiggaClawWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_BiggaClawWargear_icon.jpg",
                        "alt": "Ork BiggaClawWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                "colspan": 4,
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
                    "text": "Permanently replaces ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Powerclaw",
                    "runs": [
                      {
                        "text": "Powerclaw",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " with a ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Bigga_Claw",
                    "runs": [
                      {
                        "text": "Bigga Claw",
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
      "h": "Mega Claw",
      "level": 3,
      "anchor": "Mega_Claw_2",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Mega Claw",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/MegaClawWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/MegaClawWargear_icon.jpg",
                        "alt": "MegaClawWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Bigga_Claw_2",
                    "runs": [
                      {
                        "text": "Bigga Claw",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 4,
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
                    "text": "Permanently replaces ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Bigga_Claw",
                    "runs": [
                      {
                        "text": "Bigga Claw",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " with a ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Claw",
                    "runs": [
                      {
                        "text": "Mega Claw",
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
      "h": "Kustom Shoota",
      "level": 3,
      "anchor": "Kustom_Shoota_2",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Kustom Shoota",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_BigShootaWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_BigShootaWargear_icon.jpg",
                        "alt": "Ork BigShootaWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                "colspan": 4,
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
                    "text": "Permanently replaces ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Shoota",
                    "runs": [
                      {
                        "text": "Shoota",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " with a ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Kustom_Shoota",
                    "runs": [
                      {
                        "text": "Kustom Shoota",
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
      "h": "Mega Blasta",
      "level": 3,
      "anchor": "Mega_Blasta_2",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Mega Blasta",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_MegaBlastaWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_MegaBlastaWargear_icon.jpg",
                        "alt": "Ork MegaBlastaWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Kustom_Shoota_2",
                    "runs": [
                      {
                        "text": "Kustom Shoota",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "colspan": 4,
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
                    "text": "Permanently replaces ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Kustom_Shoota",
                    "runs": [
                      {
                        "text": "Kustom Shoota",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " with a ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Mega_Blasta",
                    "runs": [
                      {
                        "text": "Mega Blasta",
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
      "h": "Big Horns",
      "level": 3,
      "anchor": "Big_Horns_2",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Big Horns",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_BigHornsWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_BigHornsWargear_icon.jpg",
                        "alt": "Ork BigHornsWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                "colspan": 4,
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
                    "text": "</b>\n",
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
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health by 300.\n",
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
                    "text": "Warlod Gorgutz",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " with ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Big_Horns",
                    "runs": [
                      {
                        "text": "Big Horns",
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
      "h": "Red Iron Gob",
      "level": 3,
      "anchor": "Red_Iron_Gob_2",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Red Iron Gob",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_RedGobWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_RedGobWargear_icon.jpg",
                        "alt": "Ork RedGobWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                "colspan": 4,
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
                    "text": "</b>\n",
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
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health by 300\n",
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
                    "text": "Warlod Gorgutz",
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
                    "link": "/settings/wiki/Warlord_Gorgutz_Ead_Unter/#Red_Iron_Gob",
                    "runs": [
                      {
                        "text": "Red Iron Gob",
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
      "h": "Mega 'Eavy Armor",
      "level": 3,
      "anchor": "Mega_.27Eavy_Armor",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Mega 'Eavy Armor",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_MegaEavyArmorWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_MegaEavyArmorWargear_icon.jpg",
                        "alt": "Ork MegaEavyArmorWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                "colspan": 4,
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
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health by 1000.\n",
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
      "h": "Fasta Legz",
      "level": 3,
      "anchor": "Fasta_Legz",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Fasta Legz",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_FastaLegzWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_FastaLegzWargear_icon.jpg",
                        "alt": "Ork FastaLegzWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                "colspan": 4,
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
                    "text": "</b>\n",
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
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health by 300.\n",
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
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " movement speed by 33%.\n",
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
      "h": "Skullz",
      "level": 3,
      "anchor": "Skullz",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Skullz",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_SkullzWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_SkullzWargear_icon.jpg",
                        "alt": "Ork SkullzWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                "colspan": 4,
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
                    "text": "</b>\n",
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
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health by 300.\n",
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
                    "text": "Warlod Gorgutz",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " with a set of Skullz on his Pointy Stick (melee weapon, radius 10, 70 morale damage, 35 morale dps).\n",
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
      "h": "Boss Pole",
      "level": 3,
      "anchor": "Boss_Pole",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Boss Pole",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 6,
                "bg": "#add5b3",
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
                    "link": "images/Ork_BossPoleWargear_icon.jpg",
                    "runs": [
                      {
                        "image": "images/Ork_BossPoleWargear_icon.jpg",
                        "alt": "Ork BossPoleWargear icon.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "rowspan": 2,
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
                "colspan": 4,
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
                    "text": "</b>\n",
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
                    "text": "Warlod Gorgutz's",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "text": " health by 300.\n",
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
                    "text": "Increases the Ork population cap by 20 and support cap by 4.\n",
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
                    "text": "Warlord Gorgutz",
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
                    "link": "/settings/wiki/Necron_Lord_of_All_Kaurava/",
                    "runs": [
                      {
                        "text": "Necron Lord of All Kaurava",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
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
