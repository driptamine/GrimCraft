// Auto-generated from https://warhammer-guide.ru/wiki/Dawn_of_War_Stances.html — do not edit by hand.
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
export const Dawn_of_War_StancesArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Dawn of War Stances",
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
          "block": "p",
          "runs": [
            {
              "text": "One of the means of automatically managing your troops in combat is through the use of stances. Stances can determine the aggressiveness of your units, their targeting priority, and how they will attack their targets. Certain units will perform very poorly when set to the wrong stance, so properly managing this game mechanic is vital to success.\n",
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
              "text": "Combat Stances",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Combat_Stances",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "1.1",
              "text": "Hold Ground",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Hold_Ground",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "1.2",
              "text": "Stand Ground",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Stand_Ground",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "1.3",
              "text": "Burn",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Burn",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "1.4",
              "text": "Cease Fire",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Cease_Fire",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "1.5",
              "text": "Attack",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Attack",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Melee Stances",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Melee_Stances",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.1",
              "text": "Ranged",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Ranged",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 2,
              "n": "2.1.1",
              "text": "Dancing",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Dancing",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.2",
              "text": "Assault",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Assault",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 2,
              "n": "2.2.1",
              "text": "Tying Up Squads",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Tying_Up_Squads",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 2,
              "n": "2.2.2",
              "text": "Commander Duels",
              "href": "/settings/wiki/Dawn_of_War_Stances/#Commander_Duels",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "The Dawn of War Player's Guide",
              "href": "/settings/wiki/Dawn_of_War_Stances/#The_Dawn_of_War_Player.27s_Guide",
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
      "h": "Combat Stances",
      "level": 2,
      "anchor": "Combat_Stances",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Combat stances are used to determine the aggression level of the unit and can also be used to control targeting priority. Most units have one preferred stance that they function best on, but switching stances at key moments can annihilate enemy units that would otherwise escape or save overzealous units of your own that would recklessly charge to their deaths.\n",
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
      "h": "Hold Ground",
      "level": 3,
      "anchor": "Hold_Ground",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/HoldGroundStance_icon.jpg",
              "runs": [
                {
                  "image": "images/HoldGroundStance_icon.jpg",
                  "alt": "HoldGroundStance icon.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "Hold Ground (Hotkey: F1) is the default stance for most units in Dawn of War. Units on Hold Ground will attack any enemies that come within range of their weapons and will chase them up to a distance of 30 away from their starting location. Any further than that and they will come to a halt and only use ranged weapons (if they have any).\n",
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
              "text": "This stance is a poor choice for most ranged units, particularly those with setup times. Units with setup times will constantly move short distances to bring the enemy in range again, requiring them to resetup their weaponry over and over. Even if the unit can fire on the move, its damage output will be so dramatically reduced while doing so that it will accomplish little other than moving away from the bulk of the army and leaving itself vulnerable. It is usually better to leave the unit on Stand Ground to get as many parting shots in as possible without moving.\n",
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
              "text": "Melee units, on the other hand, need to be on Hold Ground stance, possibly even Attack Stance. Unless melee units have some freedom to move towards their targets, they can't actually engage them in melee and will instead just fire their weak ranged weapons (if they have any) until the enemy comes to them. Be aware that the maximum chase range of Hold Ground stance can also leave your melee units standing out in the open at the edge of their chase range, uselessly firing their weak ranged weapons. Keep an eye on your melee units to ensure that they don't end up straying too far from their starting location, stuck out of melee combat, and cut down by ranged units.\n",
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
      "h": "Stand Ground",
      "level": 3,
      "anchor": "Stand_Ground",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/StandGroundStance_icon.jpg",
              "runs": [
                {
                  "image": "images/StandGroundStance_icon.jpg",
                  "alt": "StandGroundStance icon.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "Stand Ground (Hotkey: F2) prevents all unit movement other than what you order. Stationary units on stand ground will remain completely motionless if the enemy approaches or leaves, only using ranged weaponry unless specifically ordered to attack a target in melee. If the units are moving or attack-moving to a location, they will stick to their path but will still fire their weapons at any targets of opportunity along the way that come within range of their route.\n",
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
              "text": "This stance is an excellent choice for ranged units, as it will keep them from needing to resetup their weaponry while chasing an enemy or chasing after them and firing nigh-uselessly while moving. It also provides much greater predictability of the behavior of your units, which means it is easier to control them. \n",
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
              "text": "On the other hand, melee units should never be on Stand Ground during combat as this will require every single melee target for the squad to be manually specified, a huge waste of time. It can, however, prove useful at quickly reigning in a melee squad charging towards mines or delayed abilities such as the ",
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
              "text": "'s ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Ethereal/#Air_Caste_Bombardment",
              "runs": [
                {
                  "text": "Air Caste Bombardment",
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
      "h": "Burn",
      "level": 3,
      "anchor": "Burn",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/BurnStance_icon.jpg",
              "runs": [
                {
                  "image": "images/BurnStance_icon.jpg",
                  "alt": "BurnStance icon.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "Burn stance (Hotkey: F3) functions similarly to Attack stance, but in addition to allowing the squad freedom of movement, it also forces the squad to always target enemy buildings when available. This can be an excellent choice for a base raid by ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Fire_Dragon/",
              "runs": [
                {
                  "text": "Fire Dragons",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " and other anti-building units, but be aware that the squads will attack a Listening Post over the Dreadnought ripping them apart, so closely monitor any units set to this stance.\n",
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
      "h": "Cease Fire",
      "level": 3,
      "anchor": "Cease_Fire",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/HoldFireStance_icon.jpg",
              "runs": [
                {
                  "image": "images/HoldFireStance_icon.jpg",
                  "alt": "HoldFireStance icon.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "At one time, Cease Fire stance (Hotkey: F4) was forced on units that were ",
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
              "text": ", but with Dark Crusade's reworking of the infiltration system to allow these units to fire, it serves no real purpose anymore. Occasionally, setting an infiltrated squad to Cease Fire and slipping the squad past enemy lines unnoticed to ravage their base can prove effective, but even a single detector along the infiltrated unit's path will ruin the plan and likely result in the unit's destruction. This stance can also be used to spy on the enemy forces early in the game, before they are likely to have detectors on the field. Keeping your unit from firing will mean your foe has no way of knowing that your unit is there, and so will not use abilities and weapons that can target ground on it and are less likely to prioritize detectors.  \n",
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
      "h": "Attack",
      "level": 3,
      "anchor": "Attack",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/AttackStance_icon.jpg",
              "runs": [
                {
                  "image": "images/AttackStance_icon.jpg",
                  "alt": "AttackStance icon.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "Units on Attack stance (Hotkey: F5) will hunt units until they have no more visible targets. Although this can avoid the problems melee units have when they reach the end of their leash on Hold Ground, it also makes them liable to chase a unit too far and straight into a pack of enemy units or turrets. Just like with the Hold Ground stance, Attack stance is a poor choice for ranged units because of setup times and the ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dawn_of_War_DPS/#Fire_on_the_Move",
              "runs": [
                {
                  "text": "Fire on the Move",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " accuracy penalty. Melee units on this stance still need to be watched for their own protection, but in situations where it is unlikely the enemy will be able to punish overeager melee units, this can be an easier setting to use than Hold Ground.\n",
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
      "h": "Melee Stances",
      "level": 2,
      "anchor": "Melee_Stances",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "One of the innovations of Dawn of War's combat system is the competition between melee and ranged combat. Almost all units have both ranged and melee attacks, unlike earlier RTS titles in which units were restricted to a single type. In general, units focused on ranged combat (such as ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Fire_Warrior_Team/",
              "runs": [
                {
                  "text": "Fire Warriors",
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
              "link": "/settings/wiki/guardsmen_squad/",
              "runs": [
                {
                  "text": "Imperial Guardsmen",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ") do poorly in melee, and vice versa. In addition, most units have very poor accuracy when firing on the move (e.g., while fleeing ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Khorne_Berzerker_Squad/",
              "runs": [
                {
                  "text": "Khorne Berzerkers",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": "). This means that melee units can be used to neutralize an opponent's ranged firepower (but may take a great deal of damage while closing). A unit's melee stance will dictate which mode of combat it prefers.\n",
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
              "text": "Players should remember that units engaged in melee benefit from ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dawn_of_War_Cover/#Effects_of_cover",
              "runs": [
                {
                  "text": "bonuses",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " similar to cover. Particularly important is the fact that units in melee take only 10% of morale damage from ranged weapons.\n",
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
      "h": "Ranged",
      "level": 3,
      "anchor": "Ranged",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/RangedStance_Icon2.jpg",
              "runs": [
                {
                  "image": "images/RangedStance_Icon2.jpg",
                  "alt": "RangedStance Icon2.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "Putting a squad into the ranged stance (Hotkey: F7) forces the squad to attack with only ranged weapons, if any. The squad will still engage in close combat if an enemy unit manages to get close enough to it.\n",
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
          "block": "p",
          "runs": [
            {
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Dancing",
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
              "text": "Dancing is an advanced technique in which a player with two or more squads dealing ranged damage retreats squads under fire while keeping remaining squads trained onto the enemy. This keeps the squads under attack safe, yet allows for some damage dealing. If the enemy switches targets to an attacking squad, the previously running squad is stopped (Hotkey: Q) and the squad under fire retreats. Under ideal conditions, a skilled player can eliminate most of an opponents forces with little or no casualties.\n",
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
      "h": "Assault",
      "level": 3,
      "anchor": "Assault",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/MeleeStance_icon2.jpg",
              "runs": [
                {
                  "image": "images/MeleeStance_icon2.jpg",
                  "alt": "MeleeStance icon2.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "Putting a unit into the assault stance (Hotkey: F6) forces the unit to prefer close combat over ranged combat. Rather than standing and shooting at enemy units, a unit on assault stance will charge straight at the target and attempt to engage the enemy in close quarters combat. The unit will still use its ranged weapon, provided it can be fired while moving, while closing the distance between it and the enemy squad. Units without melee weapons cannot be put on assault stance.\n",
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
              "text": "Be sure you set the unit to an appropriate aggression stance along with assault stance to ensure the squad behaves as you expect. If a unit is on Stand Ground stance, they will not charge into melee because the stand ground stance prevents them from moving from their assigned path or position. Likewise, a unit on Hold Ground has limits placed on how far they can chase enemy units, which may leave them standing still and firing their ranged weapons at a fleeing enemy. On the other hand, if a unit is on Attack stance, it may end up chasing a lone enemy squad all the way into a new army and get blown to bits. Keep an eye on your melee units and adjust their stance or orders as needed if they either stuck out of melee or running too far from the battle.\n",
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
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Tying Up Squads",
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
              "text": "If any member of a squad is in close combat, the entire squad switches to melee fighting. This can effectively force an enemy squad to stop attacking with its ranged weapons. A typical example would be to use a ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Stormboyz/",
              "runs": [
                {
                  "text": "Stormboy Squad",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " to enter close combat with a ",
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
              "text": ", thus denying them their powerful ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Fire_Warrior_Team/#Pulse_Rifle",
              "runs": [
                {
                  "text": "Pulse Rifles",
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
              "text": "If even a single enemy unit engages a squad member in melee, the entire squad joins in the fray. However, squad members need not engage the same enemy squad in melee, they will attack whatever enemy unit is closest to them regardless of whether it is in the same squad as their fellow squadmates or not. In this way a single squad can actually tie up multiple enemy squads in melee. This can only be done if the squad has not been given orders to attack a specific target. Also, squads will generally try to maintain some level of cohesion, so the enemy squads must be standing close to each other or the single squad won't be able to spread out enough to reach them all. This is far easier to achieve with a large squad (such as ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Slugga_Boy_Squad/",
              "runs": [
                {
                  "text": "Slugga Boy Squads",
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
              "text": ") as the squad can attack a larger number of enemy units simultaneously and can also spread out further without losing cohesion.\n",
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
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Commander Duels",
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
              "text": "When two commander units of opposing sides square off in melee, they will engage in a special commander duel. Note that the ",
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
              "text": " and ",
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
              "text": " cannot enter into a duel, even when they are alone. During a duel each commander slugs away at the other as fast as their melee weapons can fire, but no special effects trigger, such the ",
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
              "text": "'s poison, the ",
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
              "text": "'s stun, or the ",
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
              "text": "'s knockback. Commanders that can engage in duels will still do so when attached to squads, but only if they are attacking another duel-capable commander (who will also enter duel mode). Melee-capable uber units and walkers will also trigger a commander duel. Should one combatant attempt to flee, the duel will be broken and normal combat rules resume. The animations in a commander duel do not match the actual rate that damage is dealt, but they look much cooler than the normal melee attacks used by the two units, another of the nice touches that lends Dawn of War its unique style. \n",
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
