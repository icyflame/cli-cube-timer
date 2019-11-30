help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} \
			/^[a-zA-Z0-9_-]+:.*?## / { \
				sub("\\\\n", "", $$2); \
				printf "%-30s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

stats: ## Run a bunch of stats commands for testing
	node cli.js --help && \
		node cli.js stats && \
		node cli.js stats --bucket 5 && \
		node cli.js stats --bucket 5 --min 20 && \
		node cli.js stats --bucket 5 --min 20 --max 40 && \
		node cli.js stats --bucket 5 --min 20 --max 40 --after "2018-01-01" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --before "2018-01-01" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --after "2018-11-25" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --before "2018-11-25" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --after "2019-11-25" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --before "2019-11-25" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --after "2019-11-25" --before "2019-11-27" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --before "2019-11-27" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --after "2019-11-25" --before "2019-11-30" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --after "2019-11-25" --before "2019-11-29" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --after "2019-11-25" --before "2019-11-28" && \
		node cli.js stats --bucket 5 --min 20 --max 40 --after "2019-11-25" --before "2019-11-27"
