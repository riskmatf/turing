import requests as req
import json
import urllib


# gitlab issues api: https://docs.gitlab.com/ee/api/issues.html#new-issue

def convertGithubToGitlab(resp):
	new = []
	for issue in resp:
		current = {}
		current["id"] = issue["id"]
		current["title"] = issue["title"]
		labels = []
		for label in issue["labels"]:
			# print(label["name"])
			labels.append(label["name"])
		labels_str = ",".join(labels)
		# print(labels_str)
		current["labels"] = labels_str
		current["description"] = issue["body"]
		new.append(current)
	return new

def main():
	github_api_base = "https://api.github.com/repos/"
	github_repo_part = "riskmatf/turing/issues"
	github_url = github_api_base + github_repo_part
	print(f"Getting + {github_url}")
	res = req.get(github_url)
	if res.status_code != 200:
		print(f" ERROR: Url: {github_url} returned {res.status_code}")
		return

	github_issues = json.loads(res.text)
	gitlab_issues = convertGithubToGitlab(github_issues)
	# gitlab_project_id = input("Insert your GitLab project id:") # 
	# my test repo id
	gitlab_project_id = 17331019
	gitlab_api_url = f"https://gitlab.com/api/v4/projects/{gitlab_project_id}/issues?"

	for issue in gitlab_issues:
		query_part = urllib.parse.urlencode(issue, quote_via=urllib.parse.quote)
		gitlab_url = gitlab_api_url + query_part	
		# private_token = input("Insert your GitLab private access token: ")
		# private_token = ""
		headers = {"PRIVATE-TOKEN": private_token}
		post_res = req.post(gitlab_url + query_part, headers=headers)
		#201 is created which signals whether or not request led to creation of resource
		if post_res.status_code != 201:
			print(f"ERROR! {gitlab_url + query_part} returned {post_res.status_code}")
			print(f"Message: {post_res.text}")
		else:
			print(f"SUCCESS for issue {issue['title']}!")

	

if __name__ == "__main__":
	main()
