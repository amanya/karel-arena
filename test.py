import json

from pykarel.karel.karel import Karel
from pykarel.karel_compiler import KarelCompiler


def main():
    karel = Karel()
    compiler = KarelCompiler(karel)

    code = """
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
        "dimension": [2, 2],
        "walls": [
            [0, 1],
        ],
        "karels": [
            [0, 0, "EAST"],
        ],
        "beepers": [],
    }

    karel.load_world(json.dumps(world))
    compiler.compile(code)
    while not compiler.execute_step():
        pass

    assert karel.karel_model.karel_row == 1
    assert karel.karel_model.karel_col == 0

if __name__ == '__main__':
    main()
