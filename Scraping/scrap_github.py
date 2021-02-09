import re
import time
import requests
import traceback
from github import Github


g = Github("7629f4960da628371d797c312ab3f3e327b45120") # Personal Github token
language = "python" # What language we search on Github
start_time = time.time()


def code_cleaner(code, nb_lines=0):
    lines = code.splitlines()
    clean_code = ""
    for line in lines:
        # On supprime les sauts de lignes
        if re.match(r"^ *$", line) == None:
            # On supprime les lignes de commentaires
            if re.match(r"^[\t ]*#.*$", line) == None:
                # On supprime les commentaires de fin de lignes
                # TODO Gérer les exception :
                    # Dièse dans une string "#"
                    # Dièse échapé \#
                line = re.sub(r"#.*$", " ", line)
                # TODO Supprimer les caractères étrangés
                clean_code += f"{line}\n"
                nb_lines += 1

    return clean_code, nb_lines


def timer(s):
    h, m = 0, 0
    if s > 60:
        m = s // 60
        s = s % 60
    if m > 60:
        h = m // 60
        m = m % 60

    return f"{int(h):02d}:{int(m):02d}:{int(s):02d}"


def main():
    print("\n\nStart scraping ...")
    # Liste des repository Github utilisant Python
    repositories = g.search_repositories(query=f"language:{language}")
    print(f"\t>>> {repositories.totalCount} repositories using {language.upper()} have been found")

    nb_script = 0
    nb_lines = 0
    for repository in repositories:
        
        try:
            # On accède au repo en question
            repo = g.get_repo(repository.full_name)
        
            # Puis à son contenu
            contents = repo.get_contents("")
            while contents:
                file_content = contents.pop(0)
                
                # Si c'est un dossier, on regarde à l'intérieur
                if file_content.type == "dir":
                    contents.extend(repo.get_contents(file_content.path))
                    
                # Si c'est un fichier, on regarde l'url du code
                else:
                    nb_script += 1
                    url = file_content.download_url
                    
                    # Si c'est un fichier Python, 
                    if url[-2:] == "py" and url[-11:] != "__init__.py":
                        # On récupère le code
                        code = requests.get(url).text

                        # Nettoyage (suppression des commentaires et des sauts de ligne)
                        code, nb_lines = code_cleaner(code, nb_lines)

                        # On enregistre le code dans un fichier
                        text = f"{code}\n"
                        with open("../Data/code_dataset_test.txt", "a") as file:
                            file.write(text)
        except:
            # print("\n\tERROR =======================")
            # traceback.print_exc()
            # print("\t=============================\n")
            break

    print(f"\t>>> {nb_script} .py files have been parsed")
    print(f"\t>>> {nb_lines} lines of code have been saved")
    exec_time = round(time.time()-start_time)
    exec_time = timer(exec_time)
    print(f"End of scraping in {exec_time}\n\n")


if __name__  == "__main__":
    main()