from pykarel.karel.karel import Karel
from pykarel.karel_compiler import KarelCompiler

code = """
function main() {
  repeat(2) {
    move();
  }
}
"""


def main():
    karel = Karel()
    compiler = KarelCompiler(karel)

    with open('pykarel/world.json', 'r') as f:
        karel.load_world(f.read())

    compiler.compile(code)
    while not compiler.execute_step():
        print "hello"

if __name__ == '__main__':
    main()
