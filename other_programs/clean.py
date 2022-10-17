# this is only script to filter file from source
import os
from shutil import copyfile
import zipfile

# form https://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directory
def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file),
                       os.path.relpath(os.path.join(root, file),
                                       os.path.join(path, '..')))


def copy(src, dst):
    copyfile(src, dst)


def walk(path, func):
    global removed
    removed = 0
    for root, dirs, files in os.walk(path):
        func(root, dirs, files)


def filter(root, dirs, files):
    destiny = root.replace(work, done)
    for d in dirs:
        os.mkdir(destiny + "/" + d, 7777)
    for file in files:
        if ".go" in file[-3:]:
            continue
        copy(root + "/" + file, destiny + "/" + file)


def isEmpty(path) -> bool:
    if os.path.exists(path) and not os.path.isfile(path):
        if not os.listdir(path):
            return True
    return False


def removeEmpty(root, dirs, files):
    global removed
    for d in dirs:
        dd = root + "\\" + d
        if isEmpty(dd):
            os.rmdir(dd)
            removed += 1


version = str(input("write version: "))
done = "release"
work = "work"
removed = 0
os.mkdir(done, 7777)


def main():
    walk(work, filter)
    walk(done, removeEmpty)
    while removed > 0:
        walk(done, removeEmpty)
    zipf = zipfile.ZipFile(done + version + '.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir( done + "/", zipf)
    zipf.close()


main()
