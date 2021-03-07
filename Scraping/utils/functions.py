import re


def code_cleaner(code, nb_lines=0):
    """ Function that cleans the received code """

    lines = code.splitlines()
    clean_code = ""
    multilines_comment = False

    for line in lines:

        # Si on est dans un commentaire multilignes
        if multilines_comment:
            # On regarde si c'est la fin du commentaire
            if re.search(r"(\"{3}|'{3}) *$", line) != None:
                multilines_comment = False
            continue
            
        # On supprime les sauts de lignes
        if re.match(r"^ *$", line) != None:
            continue

        # On supprime les lignes de commentaires
        if re.match(r"^[\t ]*#.*$", line) != None:
            continue

        # On supprime les espace en fin de ligne
        line = re.sub(r" +$", "", line)

        # On supprime les commentaires de fin de lignes
        # TODO Gérer les exception :
            # Dièse dans une string "#"
            # Dièse échapé \#
        line = re.sub(r"#.*$", "", line)

        # On supprime les commentaires multilignes """Texte..."""
        if re.match(r"^[ \t]*(\"{3}|'{3}).*$", line) != None:
            # Si le commentaire ne se termine pas sur la même ligne
            if re.match(r"^.*(\"{3}|'{3}) *$", line) == None:
                multilines_comment = True
            continue

        # On supprime les caractères Chinois
        if re.search(r"\\p{Han}", line) != None:
            continue

        # On supprime les caractères non utf-8
        # if re.search(r"([\x00-\x7F]|[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|[\xEE-\xEF][\x80-\xBF]{2}|\xF0[\x90-\xBF][\x80-\xBF]{2}|[\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2})*", line) != None:
        #     print(">>>", line)
        #     continue


        clean_code += f"{line}\n"
        nb_lines += 1

    return clean_code, nb_lines


def extract_functions(code, nb_functions=0):
    """ Function which extracts the functions of the received code """

    lines = code.splitlines()
    functions = ""
    is_funct = 0
    nb_spaces = 0

    for line in lines:
        if is_funct:
            if is_funct == 1:
                nb_spaces = len(line) - len(line.lstrip(" "))

            if len(line) - len(line.lstrip(" ")) >= nb_spaces:
                functions += f"{line}\n"
            else:
                functions += "\n" # TODO Ne fonctionne pas !!
                is_funct = 0

        # TODO Pourquoi les class ne sont pas filtrées ???
        # TODO Filtrer les __init__


        elif re.match(r"^[ \t]*def.*$", line) != None:
            functions += f"{line}\n"
            nb_functions += 1
            is_funct = 1

    return functions, nb_functions


def timer(s):
    """ Function that formats the received time """

    h, m = 0, 0
    if s > 60:
        m = s // 60
        s = s % 60
    if m > 60:
        h = m // 60
        m = m % 60

    return f"{int(h):02d}:{int(m):02d}:{int(s):02d}"


