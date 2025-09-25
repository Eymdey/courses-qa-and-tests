from git import Repo
import os

# chemin local où tu veux cloner
local_dir = os.path.join(os.getcwd(), "courses-qa-and-tests")

# URL de TON fork (remplace USERNAME par ton pseudo GitHub)
fork_url = "https://github.com/Eymdey/courses-qa-and-tests.git"

# Cloner le repo
if not os.path.exists(local_dir):
    print("Clonage du repo...")
    Repo.clone_from(fork_url, local_dir)
else:
    print("Le repo existe déjà :", local_dir)

repo = Repo(local_dir)
print("Branches disponibles :", [branch.name for branch in repo.branches])

repo.git.add(all=True)
repo.index.commit("Mon premier commit via GitPython")
origin = repo.remote(name='origin')
origin.push()


