import json
import random
import re

START = """ig.module( 'game.levels.level0' )
.requires( 'impact.image','game.entities.beeper','game.entities.tray','game.entities.karel','game.entities.trigger','game.entities.levelchange','game.entities.exit' )
.defines(function(){
LevelLevel0=/*JSON[*/"""
END = """/*]JSON*/;
LevelLevel0Resources=[new ig.Image('media/tileset.png')];
});"""


def to_map(coord):
    return int(coord / 24)


def from_map(coord):
    return coord * 24


class ImpactMap:
    def __init__(self):
        self.impact_map = {}

    def initialize(self):
        with open('levels/level.json') as f:
            self.impact_map = json.loads(f.read())
        self.karel_initial_positions = self.get_initial_positions()

    def load(self, map):
        self.impact_map = json.loads(map.decode("utf-8"))

    def __str__(self):
        return START + json.dumps(self.impact_map) + END

    def get_dimension(self):
        return self.impact_map["layer"][0]["width"], self.impact_map["layer"][0]["height"]

    def _get_collision_layer(self):
        for layer in self.impact_map["layer"]:
            if layer["name"] == "collision":
                return layer

    def get_walls(self):
        collision_layer = self._get_collision_layer()
        rows, cols = self.get_dimension()
        walls = []
        for i in range(0, cols):
            for j in reversed(range(0, rows)):
                if collision_layer["data"][i][j] == 1:
                    walls.append((i, j))
        return walls

    def get_beepers(self):
        beepers = []
        for entity in self.impact_map["entities"]:
            if entity["type"] == "EntityBeeper":
                beepers.append((to_map(entity["y"]), to_map(entity["x"])))
        return beepers

    def _valid_place(self, x, y):
        collision_layer = self._get_collision_layer()
        if collision_layer["data"][x][y] == 1:
            return False
        mx = from_map(x)
        my = from_map(y)
        for entity in self.impact_map["entities"]:
            if entity["type"] in ["EntityKarel", "EntityBeeper", "EntityTray"]:
                if entity["x"] == mx and entity["y"] == my:
                    return False
        return True

    def _pick_random_position(self):
        rows, cols = self.get_dimension()
        x = y = None
        while True:
            x, y = random.randint(0, cols-1), random.randint(0, rows-1)
            if self._valid_place(x, y):
                break
        return x, y

    def spawn_beeper(self):
        x, y = self._pick_random_position()
        beeper = {
            "type": "EntityBeeper",
            "x": from_map(x),
            "y": from_map(y),
        }
        self.impact_map["entities"].append(beeper)
        return beeper

    def get_initial_positions(self):
        karels = {}
        for entity in self.impact_map["entities"]:
            if entity["type"] == "EntityKarel":
                handle = entity["settings"]["name"]
                karels[handle] = [entity["y"], entity["x"], entity["settings"]["facing"]]
        return karels

    def reset_karel(self, handle):
        for entity in self.impact_map["entities"]:
            if entity["type"] == "EntityKarel":
                entity_name = entity["settings"]["name"]
                if entity_name == handle:
                    entity["y"] = self.karel_initial_positions[handle][0]
                    entity["x"] = self.karel_initial_positions[handle][1]
                    entity["settings"]["facing"] = self.karel_initial_positions[handle][2]

    def get_karels(self):
        karels = []
        for entity in self.impact_map["entities"]:
            if entity["type"] == "EntityKarel":
                karels.append((entity["settings"]["name"], to_map(entity["y"]), to_map(entity["x"]), entity["settings"]["facing"]))
        return karels

    def get_trays(self):
        trays = []
        for entity in self.impact_map["entities"]:
            if entity["type"] == "EntityTray":
                trays.append(
                    (
                        to_map(entity["y"]),
                        to_map(entity["x"]),
                        entity["settings"]["capacity"],
                        entity["settings"]["required"],
                        entity["settings"]["initialBeepers"],
                    )
                )
        return trays

    def get_exits(self):
        exits = []
        for entity in self.impact_map["entities"]:
            if entity["type"] == "EntityExit":
                exits.append(
                    (
                        to_map(entity["y"]),
                        to_map(entity["x"]),
                    )
                )
        return exits

    def to_compiler(self):
        world = {}
        world["dimension"] = self.get_dimension()
        world["walls"] = self.get_walls()
        world["beepers"] = self.get_beepers()
        world["karels"] = self.get_karels()
        world["trays"] = self.get_trays()
        world["exits"] = self.get_exits()
        return world

    def from_compiler(self, world):
        entities_to_clear = ["EntityBeeper", "EntityKarel", "EntityTray"]
        entities = [e for e in self.impact_map["entities"] if e["type"] not in entities_to_clear]
        for x, y in world["beepers"]:
            beeper = {
                "type": "EntityBeeper",
                "x": from_map(x),
                "y": from_map(y)
            }
            entities.append(beeper)
        for x, y, capacity, required, num_beepers in world["trays"]:
            tray = {
                "type": "EntityTray",
                "x": from_map(x),
                "y": from_map(y),
                "settings": {
                    "capacity": capacity,
                    "initialBeepers": num_beepers,
                    "required": required,
                    "owner": ""
                }
            }
            entities.append(tray)
        for name, x, y, dir in world["karels"]:
            karel = {
                "type": "EntityKarel",
                "x": from_map(x),
                "y": from_map(y),
                "settings": {
                    "facing": dir,
                    "name": name
                }
            }
            entities.append(karel)

        self.impact_map["entities"] = entities


if __name__ == '__main__':
    m = Map()
    print(m)
