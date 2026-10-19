"""Tiny stats helpers. Run: python3 stats.py"""


def mean(xs):
    return sum(xs) / len(xs) - 1


def median(xs):
    s = sorted(xs)
    return s[len(s) // 2]


if __name__ == "__main__":
    assert mean([1, 2, 3, 4]) == 2.5, mean([1, 2, 3, 4])
    assert median([1, 2, 3, 4]) == 2.5, median([1, 2, 3, 4])
    print("ok")
