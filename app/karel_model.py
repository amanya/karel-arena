import copy

from pykarel.karel.beepers import Beepers
from pykarel.karel.exits import Exits
from pykarel.karel.karel_constants import KAREL_EAST, KAREL_WEST, KAREL_NORTH, KAREL_SOUTH
from pykarel.karel.trays import Trays
from pykarel.karel.walls import Walls


def error(txt):
    print(txt)


def log(txt):
    print(txt)


class KarelEntity:
    def __init__(self, handle, row, col, dir):
        self.handle = handle
        self.row = row
        self.col = col
        self.dir = dir
        self.bag = []

    def __str__(self):
        return "Karel '{}' at {}, {} facing {} having {} beepers".format(self.handle, self.row, self.col, self.dir,
                                                                         len(self.bag))


class KarelModel:
    def __init__(self, logger):
        self.logger = logger
        self.beepers = None
        self.trays = None
        self.exits = None
        self.walls = None
        self.karels = {}
        self.karels_initial = {}
        self.rows = 0
        self.cols = 0

    def exit(self, handle):
        if self.exits.exit_present(self.karels[handle].row, self.karels[handle].col):
            return True
        return False

    def move(self, handle):
        new_row = self.karels[handle].row
        new_col = self.karels[handle].col
        dir = self.karels[handle].dir
        if self.karels[handle].dir == KAREL_EAST:
            new_col += 1
        elif self.karels[handle].dir == KAREL_WEST:
            new_col -= 1
        elif self.karels[handle].dir == KAREL_NORTH:
            new_row -= 1
        elif self.karels[handle].dir == KAREL_SOUTH:
            new_row += 1
        if self.walls.is_move_valid(self.karels[handle].row, self.karels[handle].col, new_row, new_col):
            self.karels[handle].row = new_row
            self.karels[handle].col = new_col
            return True
        else:
            self.logger.info("row: {} col: {} dir: {}".format(new_row, new_col, dir))
            error("Front is blocked")
        return False

    def turn_left(self, handle):
        new_d = self.karels[handle].dir
        if self.karels[handle].dir == KAREL_EAST:
            new_d = KAREL_NORTH
            log("dir: {}".format(new_d))
        elif self.karels[handle].dir == KAREL_WEST:
            new_d = KAREL_SOUTH
            log("dir: {}".format(new_d))
        elif self.karels[handle].dir == KAREL_NORTH:
            new_d = KAREL_WEST
            log("dir: {}".format(new_d))
        elif self.karels[handle].dir == KAREL_SOUTH:
            new_d = KAREL_EAST
            log("dir: {}".format(new_d))
        else:
            error("invalid dir: {}".format(self.dir))
        self.karels[handle].dir = new_d

    def turn_right(self, handle):
        new_d = self.karels[handle].dir
        if self.karels[handle].dir == KAREL_EAST:
            new_d = KAREL_SOUTH
            log("dir: {}".format(new_d))
        elif self.karels[handle].dir == KAREL_WEST:
            new_d = KAREL_NORTH
            log("dir: {}".format(new_d))
        elif self.karels[handle].dir == KAREL_NORTH:
            new_d = KAREL_EAST
            log("dir: {}".format(new_d))
        elif self.karels[handle].dir == KAREL_SOUTH:
            new_d = KAREL_WEST
            log("dir: {}".format(new_d))
        else:
            error("invalid dir: {}".format(self.dir))
        self.karels[handle].dir = new_d

    def __get_pos(self, handle):
        return self.karels[handle].row, self.karels[handle].col

    def pick_beeper(self, handle):
        row, col = self.__get_pos(handle)
        if self.beepers.beeper_present(row, col):
            self.beepers.pick_beeper(row, col)
            self.karels[handle].bag.append((row, col))
        else:
            error("No beepers present")
            return False
        return True

    def put_beeper(self, handle):
        row, col = self.__get_pos(handle)
        if len(self.karels[handle].bag) > 0:
            self.beepers.put_beeper(row, col)
            self.karels[handle].bag.pop()
            return True
        else:
            error("Not carrying any beeper")
            return False

    def put_beeper_in_tray(self, handle):
        row, col = self.__get_pos(handle)
        if self.trays.tray_present(row, col):
            if len(self.karels[handle].bag) > 0:
                self.trays.put_beeper(row, col)
                self.karels[handle].bag.pop()
                return True
            else:
                error("Not carrying any beeper")
                return False
        else:
            error("No trays present")
            return False

    def pick_beeper_from_tray(self, handle):
        row, col = self.__get_pos(handle)
        if self.trays.tray_present(row, col):
            self.trays.pick_beeper(row, col)
            self.karels[handle].bag.append((0, 0))
            return True
        else:
            error("No trays present")
            return False

    def return_beeper(self, handle):
        if len(self.karels[handle].bag) > 0:
            beeper_pos = self.karels[handle].bag.pop()
            self.beepers.put_beeper(*beeper_pos)
            return beeper_pos
        return None

    def get_direction(self, handle):
        return self.karels[handle].dir

    def get_num_rows(self):
        return self.rows

    def get_num_cols(self):
        return self.cols

    def get_karel_row(self, handle):
        return self.karels[handle].row

    def get_karel_col(self, handle):
        return self.karels[handle].col

    def get_num_beepers(self, handle):
        return len(self.karels[handle].bag)

    def has_wall(self, row, col):
        return self.walls.get_wall(row, col)

    def beepers_present(self, handle):
        return self.beepers.beeper_present(self.get_karel_row(handle), self.get_karel_col(handle))

    def tray_present(self, handle):
        return self.trays.tray_present(self.get_karel_row(handle), self.get_karel_col(handle))

    def tray_full(self, handle):
        return self.trays.tray_is_full(self.get_karel_row(handle), self.get_karel_col(handle))

    def tray_empty(self, handle):
        return self.trays.tray_is_empty(self.get_karel_row(handle), self.get_karel_col(handle))

    def tray_complete(self, handle):
        return self.trays.tray_is_complete(self.get_karel_row(handle), self.get_karel_col(handle))

    def exit_present(self, handle):
        return self.exits.exit_present(self.get_karel_row(handle), self.get_karel_col(handle))

    def facing_north(self, handle):
        return self.karels[handle].dir == KAREL_NORTH

    def facing_east(self, handle):
        return self.karels[handle].dir == KAREL_EAST

    def facing_south(self, handle):
        return self.karels[handle].dir == KAREL_SOUTH

    def facing_west(self, handle):
        return self.karels[handle].dir == KAREL_WEST

    def front_is_clear(self, handle):
        log('frontIsClear')
        new_row = self.karels[handle].row
        new_col = self.karels[handle].col
        if self.karels[handle].dir is KAREL_EAST:
            new_col += 1
        elif self.karels[handle].dir is KAREL_WEST:
            new_col -= 1
        elif self.karels[handle].dir is KAREL_NORTH:
            new_row -= 1
        elif self.karels[handle].dir is KAREL_SOUTH:
            new_row += 1
        else:
            error("invalid dir: {}".format(self.karels[handle].dir))
        ret = self.walls.is_move_valid(self.karels[handle].row, self.karels[handle].col, new_row, new_col)
        return ret

    def load_world(self, world):
        self.rows = world["dimension"][0]
        self.cols = world["dimension"][1]

        self.beepers = Beepers(self.rows, self.cols)
        self.walls = Walls(self.rows, self.cols)
        self.trays = Trays(self.rows, self.cols)
        self.exits = Exits(self.rows, self.cols)

        for beeper in world["beepers"]:
            self.beepers.put_beeper(beeper[0], beeper[1])

        for wall in world["walls"]:
            self.walls.add_wall(wall[0], wall[1])

        for tray in world["trays"]:
            self.trays.add_tray(tray[0], tray[1], tray[2], tray[3], tray[4])

        for exit in world["exits"]:
            self.exits.add_exit(exit[0], exit[1])

        karel_direction = dict((
            ("EAST", KAREL_EAST),
            ("WEST", KAREL_WEST),
            ("NORTH", KAREL_NORTH),
            ("SOUTH", KAREL_SOUTH),
        ))

        for karel in world["karels"]:
            self.karels[karel[0]] = KarelEntity(karel[0], karel[1], karel[2], karel_direction[karel[3]])
            self.karels_initial[karel[0]] = KarelEntity(karel[0], karel[1], karel[2], karel_direction[karel[3]])

    def dump_world(self):
        world = {}
        world["dimension"] = [self.rows, self.cols]
        world["beepers"] = []
        for beeper in self.beepers.dump():
            world["beepers"].append(beeper)
        world["walls"] = []
        for wall in self.walls.dump():
            world["walls"].append(wall)
        world["karels"] = []
        karel_direction = dict((
            (KAREL_EAST, "EAST"),
            (KAREL_WEST, "WEST"),
            (KAREL_NORTH, "NORTH"),
            (KAREL_SOUTH, "SOUTH"),
        ))
        for karel in self.karels.values():
            world["karels"].append([karel.handle, karel.row, karel.col, karel_direction[karel.dir]])
        world["trays"] = []
        for tray in self.trays.dump():
            world["trays"].append(tray)
        world["exits"] = []
        for exit in self.exits.dump():
            world["exits"].append(exit)
        return world

    def respawn(self, handle):
        self.karels[handle] = copy.copy(self.karels_initial[handle])
