from flask import Flask, render_template, request, flash
import re

app = Flask(__name__)
app.secret_key = 'euler_brick_secret_key_2025'

def IsItEuler(triple1, triple2):
    """
    Check if two Pythagorean triples can form two faces of an Euler Brick.

    An Euler Brick has integer dimensions a, b, c where all face diagonals
    are also integers. Each triple represents a face diagonal and the two
    edges of that face.

    For two triples to be part of the same Euler Brick, they must share
    exactly one edge (dimension).

    Args:
        triple1: tuple of 3 positive integers (a, b, c) where a² + b² = c²
        triple2: tuple of 3 positive integers (x, y, z) where x² + y² = z²

    Returns:
        bool: True if the triples share exactly one edge, False otherwise
    """
    # Convert tuples to sets for intersection
    set1 = set(triple1)
    set2 = set(triple2)

    # Find common elements
    common = set1.intersection(set2)

    # Must have exactly one common element
    if len(common) != 1:
        return False

    # Get the shared dimension
    shared_dim = common.pop()

    # For each triple, identify which element is the hypotenuse
    def find_hypotenuse(triple):
        """Return the hypotenuse of the triple."""
        a, b, c = triple
        if a*a + b*b == c*c:
            return c
        elif a*a + c*c == b*b:
            return b
        elif b*b + c*c == a*a:
            return a
        else:
            # Not a valid Pythagorean triple
            return None

    hyp1 = find_hypotenuse(triple1)
    hyp2 = find_hypotenuse(triple2)

    # If either triple is invalid, return False
    if hyp1 is None or hyp2 is None:
        return False

    # The shared dimension should NOT be the hypotenuse in either triple
    if shared_dim == hyp1 or shared_dim == hyp2:
        return False

    # Extract the leg dimensions for each triple (excluding hypotenuse and shared dimension)
    legs1 = [x for x in triple1 if x != hyp1 and x != shared_dim]
    legs2 = [x for x in triple2 if x != hyp2 and x != shared_dim]

    if len(legs1) != 1 or len(legs2) != 1:
        return False

    dim1 = legs1[0]  # First triple's unique leg
    dim3 = legs2[0]  # Second triple's unique leg

    # Check the third face diagonal - must be integer for Euler Brick
    third_diagonal_squared = dim1*dim1 + dim3*dim3
    third_diagonal = third_diagonal_squared ** 0.5

    if not third_diagonal.is_integer():
        return False

    return True

def parse_triple_input(input_str):
    """
    Parse a string input into a tuple of 3 integers.
    Accepts formats like: (3,4,5), 3,4,5, [3,4,5], or 3 4 5
    """
    try:
        # Remove whitespace and common delimiters
        cleaned = re.sub(r'[\(\)\[\]\s]', '', input_str)
        parts = cleaned.split(',')

        # If only one comma, try splitting by space
        if len(parts) == 1:
            parts = cleaned.split()

        # Should have exactly 3 parts
        if len(parts) != 3:
            return None

        # Convert to integers
        return tuple(int(x.strip()) for x in parts)
    except (ValueError, AttributeError):
        return None

@app.route('/', methods=['GET', 'POST'])
def index():
    result = None
    triple1_input = ""
    triple2_input = ""
    triple1 = None
    triple2 = None

    if request.method == 'POST':
        triple1_input = request.form.get('triple1', '').strip()
        triple2_input = request.form.get('triple2', '').strip()

        # Parse inputs
        triple1 = parse_triple_input(triple1_input)
        triple2 = parse_triple_input(triple2_input)

        if not triple1 or not triple2:
            flash("Please enter valid triples in the format: 3,4,5 or (3,4,5) or [3,4,5]", "error")
        elif triple1 == triple2:
            flash("Please enter two different triples", "error")
        else:
            # Check if they are valid Pythagorean triples
            def is_valid_pythagorean(triple):
                a, b, c = sorted(triple)
                return a*a + b*b == c*c

            if not is_valid_pythagorean(triple1):
                flash(f"First triple {triple1} is not a valid Pythagorean triple", "error")
            elif not is_valid_pythagorean(triple2):
                flash(f"Second triple {triple2} is not a valid Pythagorean triple", "error")
            else:
                result = IsItEuler(triple1, triple2)

    return render_template('index.html',
                         result=result,
                         triple1=triple1_input,
                         triple2=triple2_input,
                         parsed_triple1=triple1,
                         parsed_triple2=triple2)

def test_euler_brick_logic():
    """Test the Euler Brick logic with various test cases."""

    test_cases = [
        # (triple1, triple2, expected_result, description)
        ((44, 117, 125), (117, 240, 267), True, "Known Euler brick 44x117x240"),
        ((117, 44, 125), (240, 117, 267), True, "Permuted order, same Euler brick"),
        ((6, 8, 10), (8, 15, 17), False, "Third diagonal sqrt(36+225)=sqrt(261) not integer"),
        ((3, 4, 5), (4, 3, 5), False, "Both triples share both legs (3,4)"),
        ((44, 117, 125), (117, 240, 266), False, "Second triple invalid (117^2+240^2 != 266^2)"),
        ((44, 117, 125), (118, 240, 267), False, "No shared edge"),
        ((0, 0, 0), (3, 4, 5), False, "Invalid input (zeros)"),
        ((-3, 4, 5), (3, 4, 5), False, "Invalid input (negative number)"),
        ((4400000000000001, 117, 125), (117, 240, 267), False, "Large numbers - potential overflow"),
    ]

    print("Testing Euler Brick Logic")
    print("=" * 60)

    passed = 0
    total = len(test_cases)

    for i, (triple1, triple2, expected, description) in enumerate(test_cases, 1):
        try:
            result = IsItEuler(triple1, triple2)
            status = "PASS" if result == expected else "FAIL"
            if result == expected:
                passed += 1

            print(f"Test {i}: {description}")
            print(f"  Input:    {triple1} + {triple2}")
            print(f"  Expected: {expected}")
            print(f"  Got:      {result}")
            print(f"  Status:   {status}")
            print()

        except Exception as e:
            print(f"Test {i}: {description}")
            print(f"  Input:    {triple1} + {triple2}")
            print(f"  Expected: {expected}")
            print(f"  Got:      ERROR - {str(e)}")
            print(f"  Status:   FAIL (Exception)")
            print()

    print("=" * 60)
    print(f"Results: {passed}/{total} tests passed")

    if passed == total:
        print("All tests passed!")
    else:
        print(f"{total - passed} tests failed")

    return passed == total

if __name__ == '__main__':
    # Run tests first
    test_euler_brick_logic()
    print("\n" + "="*60 + "\n")

    # Then start the Flask app
    app.run(debug=True)
