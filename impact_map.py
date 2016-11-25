import json
import re

from pykarel.karel.walls import Walls

START = """ig.module( 'game.levels.level0' )
.requires( 'impact.image','game.entities.beeper','game.entities.tray','game.entities.karel','game.entities.trigger','game.entities.levelchange','game.entities.exit' )
.defines(function(){
LevelLevel0=/*JSON[*/"""
END = """/*]JSON*/;
LevelLevel0Resources=[new ig.Image('media/tileset.png')];
});"""


def to_map(coord):
    return coord / 24

class ImpactMap:
    def __init__(self, logger):
        self.logger = logger
        with open('static/lib/game/levels/level0.js') as f:
            self.impact_map = json.loads(re.search('\/\*JSON\[\*\/(.+?)\/\*\]JSON\*\/', f.read()).group(1))

    def __str__(self):
        return START + json.dumps(self.impact_map) + END

    def get_dimension(self):
        return self.impact_map["layer"][0]["width"], self.impact_map["layer"][0]["height"]

    def get_collision_layer(self):
        for layer in self.impact_map["layer"]:
            if layer["name"] == "collision":
                return layer

    def get_walls(self):
        collision_layer = self.get_collision_layer()
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
                beepers.append((to_map(entity["x"]), to_map(entity["y"])))
        return beepers

    def get_karels(self):
        karels = []
        for entity in self.impact_map["entities"]:
            if entity["type"] == "EntityKarel":
                karels.append((entity["settings"]["name"], to_map(entity["y"]), to_map(entity["x"])))
        return karels

    def to_compiler(self):
        world = {}
        world["dimension"] = self.get_dimension()
        world["walls"] = self.get_walls()
        world["beepers"] = self.get_beepers()
        world["karels"] = self.get_karels()
        return world


if __name__ == '__main__':
    m = Map()
    print(m)
