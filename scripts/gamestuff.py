def generate_deck():
    res = []
    for i in range(3):
        for j in range(3):
            for k in range(3):
                for l in range(3):
                    res.append(str(i)+str(j)+str(k)+str(l))
    return res

def get_third_card(first, second):
    third = ""
    for i in range(4):
        if first[i] == second[i]:
            third += first[i]
        else:
            third += str(3 - int(first[i]) - int(second[i]))
    return third


# brute force generation of all 1080 unique sets in the deck
def generate_all_sets(deck):
    res = set()
    for i in range(len(deck)):
        for j in range(i + 1, len(deck)):
            a = deck[i] # first card
            b = deck[j] # second card

            c = get_third_card(a, b) # generate third card

            trio = [a, b, c]
            trio.sort()
            res.add(tuple(trio))

    return res

# compares every trio in cards to see if it is in all_sets
def get_all_sets(cards, all_sets):
    print(cards)
    res = []
    for i in range(len(cards)):
        for j in range(i, len(cards)):
            for k in range(j, len(cards)):
                if i == j == k:
                    continue
                tup = tuple([cards[i], cards[k], cards[j]])
                if tup  in all_sets:
                    res.append(tup)
    return res

def get_card_input():
    res = []
    entry = input("Enter card or leave blank to end:\t")
    while entry:
        res.append(entry)
        entry = input("Enter next card or leave blank to end:\t")
    return res

deck = generate_deck()
# print(deck, "of length " + str(len(deck)))

sets = generate_all_sets(deck)
# print(len(sets))


sol = get_all_sets(get_card_input(), sets)
print(sol, len(sol))


