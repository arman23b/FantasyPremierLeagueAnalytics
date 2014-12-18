import os, sys, shutil

def main():

    name = os.path.split(os.getcwd())[-1]

    if name == "djangoStarter":
        print ("Please change the name of the current directory to something besides \"djangoStarter\"")
        return None

    sys.stdout.write("setting up project: \"%s\"..." % name)

    # string replace files files
    recursiveReplace('core', '[*projectName*]', name)
    recursiveReplace('projectName', '[*projectName*]', name)
    fileReplace('Procfile', '[*projectName*]', name)
    fileReplace('manage.py', '[*projectName*]', name)

    # rename the project directory
    os.rename("projectName", name)

    # delete this file
    os.remove('setup.py')

    print ("done!")

def recursiveReplace(dir, oldStr, newStr):
    for dirName, subdirList, fileList in os.walk(dir):
        for fname in fileList:
            fullName = os.path.join(dirName, fname)
            fileReplace(fullName, oldStr, newStr)


def fileReplace(fileName, oldStr, newStr):
    with open(fileName) as f:
        file = f.read()
        newfile = file.replace(oldStr,newStr)
        open(fileName,"w").write(newfile)


main()
