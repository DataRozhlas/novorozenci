import csv

single_names = []

names_ignore = ["SOUČET", "NEZJIŠTĚNO", "NEUVEDENO", "NEURČENO"]

#names for autocomplete
with open('data.csv') as file:
	reader = csv.DictReader(file)
	for row in reader:
		if int(row["3000"]) > 5 and row["JMÉNO"] not in names_ignore and " " not in row["JMÉNO"]:
			single_names.append('"' + row["JMÉNO"].title() + '",')

with open('nametest.csv', 'w') as file:
	for name in single_names:
		file.write(name)