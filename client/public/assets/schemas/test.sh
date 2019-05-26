errs=$(cat $1 | grep 'err' | wc -l)
comp=$(cat $1 | grep 'comp' | wc -l)

echo "Testing file $1....."
echo "errs: $errs"
echo "comps: $comp"
