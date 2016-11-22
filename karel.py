from pykarel.karel.karel_model import KarelModel

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

    def __init__(self, app, redis):
        self.karel_model = KarelModel()
        self.app = app
        self.redis = redis

    def draw(self, c):
        pass

    def move(self):
        self.app.logger.info("Hello")
        if self.karel_model.move():
            command = '{"receiver": "karel-blue", "command": "move"}'
            self.app.logger.info(u'Inserting command: {}'.format(command))
            self.redis.publish(REDIS_CHAN, command)
            log("move")

    def load_world(self, text):
        self.karel_model.load_world(text)


INFINITY = 100000000
INCREMENT = -1
DECREMENT = -2