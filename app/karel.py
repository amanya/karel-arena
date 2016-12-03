from karel_model import KarelModel

REDIS_CHAN = 'karel'

def log(text):
    print(text)


class Karel:
    instructions = dict(
        move=1, turnLeft=1, putBeeper=1, pickBeeper=1,
        turnRight=2, turnAround=2, paintCorner=2,
        putBeeperInTray=1, pickBeeperFromTray=1,
        exit=1
    )

    predicates = dict(
        frontIsClear=1, frontIsBlocked=1,
        leftIsClear=1, leftIsBlocked=1,
        rightIsClear=1, rightIsBlocked=1,
        beepersPresent=1, noBeepersPresent=1,
        beepersInBag=1, noBeepersInBag=1,
        trayPresent=1, noTrayPresent=1,
        trayFull=1, trayNotFull=1,
        exitPresent=1, noExitPresent=1,
        facingNorth=1, notFacingNorth=1,
        facingEast=1, notFacingEast=1,
        facingSouth=1, notFacingSouth=1,
        facingWest=1, notFacingWest=1,
        cornerColorIs=2, random=2
    )

    def __init__(self, app, redis, handle):
        self.karel_model = KarelModel()
        self.app = app
        self.redis = redis
        self.handle = handle

    def draw(self, c):
        pass

    def turnLeft(self):
        self.karel_model.turn_left(self.handle)
        command = '{"handle": "%s", "command": "turnLeft"}' % self.handle
        self.app.logger.info(u'Inserting command: {}'.format(command))
        self.redis.publish(REDIS_CHAN, command)
        log("turnLeft")

    def turnRight(self):
        self.karel_model.turn_right(self.handle)
        command = '{"handle": "%s", "command": "turnRight"}' % self.handle
        self.app.logger.info(u'Inserting command: {}'.format(command))
        self.redis.publish(REDIS_CHAN, command)
        log("turnRight")

    def frontIsClear(self):
        return self.karel_model.frontIsClear(self.handle)

    def beepersPresent(self):
        return self.karel_model.beepers_present(self.handle)

    def move(self):
        if self.karel_model.move(self.handle):
            command = '{"handle": "%s", "command": "move"}' % self.handle
            self.app.logger.info(u'Inserting command: {}'.format(command))
            self.redis.publish(REDIS_CHAN, command)
            log("move")

    def pickBeeper(self):
        if self.karel_model.pick_beeper(self.handle):
            command = '{"handle": "%s", "command": "pickBeeper"}' % self.handle
            self.app.logger.info(u'Inserting command: {}'.format(command))
            self.redis.publish(REDIS_CHAN, command)
            log("pickBeeper")
        else:
            command = '{"handle": "%s", "command": "die"}' % self.handle
            self.app.logger.info(u'Inserting command: {}'.format(command))
            self.redis.publish(REDIS_CHAN, command)
            log("die")

    def load_world(self, world):
        self.karel_model.load_world(world)

    def dump_world(self):
        return self.karel_model.dump_world()


INFINITY = 100000000
INCREMENT = -1
DECREMENT = -2
