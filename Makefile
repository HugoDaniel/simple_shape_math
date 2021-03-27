src = $(wildcard *.ts)
obj = $(src:.ts=.js)
min = $(obj:.js=.min.js)

%.js: %.ts
	deno bundle -c denoconfig.json $< $@

%.min.js: %.js
	terser $< -o $@ -c

build: $(obj) $(min)
	mkdir -p build/
	mv *.js build/

test:
	deno test

clean:
	rm -rf build

