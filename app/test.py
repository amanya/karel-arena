import json

from pykarel.karel.karel import Karel
from pykarel.karel_compiler import KarelCompiler


def main():
    karel1 = Karel()
    karel2 = Karel()
    compiler1 = KarelCompiler(karel1)
    compiler2 = KarelCompiler(karel2)

    code1 = """
        function main() {
          repeat(10){
            if(frontIsClear()){
              move();
            } else {
              turnLeft();
              move();
            }
          }
        }
    """

    code2 = """
        function main() {
           if(frontIsClear()){
               move();
           } else {
               turnLeft();
               turnLeft();
               turnLeft();
               move();
           }
        }
    """

    world = {
        "dimension": [10, 10],
        "walls": [
            [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9],
            [1, 0], [1, 9],
            [2, 0], [2, 9],
            [3, 0], [3, 9],
            [4, 0], [4, 9],
            [5, 0], [5, 9],
            [6, 0], [3, 9],
            [7, 0], [3, 9],
            [8, 0], [3, 9],
            [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9],
        ],
        "karels": [
            [1, 1, "EAST"],
            [8, 8, "WEST"],
        ],
        "beepers": [],
        "trays": [],
    }

    karel1.load_world(json.dumps(world))
    karel2.load_world(json.dumps(world))
    compiler1.compile(code1)
    compiler2.compile(code2)
    running = True
    while running:
        print "step"
        st1 = compiler1.execute_step()
        st2 = compiler2.execute_step()
        if st1 is True and st2 is True:
            running = False

    assert karel1.karel_model.karel_row == 1
    assert karel1.karel_model.karel_col == 0

if __name__ == '__main__':
    main()
