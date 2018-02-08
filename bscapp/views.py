from django.shortcuts import render,redirect
from django.http import HttpResponse, FileResponse,Http404
from django.template import loader
from django.contrib.auth import authenticate,login,logout
import os

#UNCOMMENT FOR LINUX
#from weasyprint import HTML, CSS

from .models import tablerow,Scorecard,Observation,Shares
import json, hashlib
import pdfkit

from auth0.v3.authentication import GetToken
from auth0.v3.authentication import Users

from urlparse import urlparse

client_id = "vE0hJ4Gx1uYG9LBtuxgqY7CTIFmKivFH"
client_secret = "Mk-vnlkbSoBxIVJnOTqAqpIh6lH4Kdi2n7H9y9DbaNPfzK8n1s5rTuQv3GmHDKWJ"

def index(request):
	#template = loader.get_template('templates\\index.html')
	return render(request, 'bscapp/index.html')

def guide(request):
	return render(request, 'bscapp/guide.html')

def access(request):
	return render(request, 'bscapp/access_app.html')

def related(request):
	return render(request, 'bscapp/related_documents.html')

def login_view(request):
	'''
	username = request.POST['username']
	password = request.POST['password']
	user = authenticate(request=request, username=username, password=password)
	if user is not None:
		login(request, user)
	context = {'user': request.user}
	'''
	request.session['bscapp_profile'] = json.loads('{"email": "pottsie"}')
	#print request.POST['username']
	#print "logged in"
	return redirect('bscapp_index')

def logout_view(request):
	logout(request)
	return redirect('index')

def save_tables(request):
	text_json = request.POST['tablejson']
	parsed_json = json.loads(text_json)
	scorecard_name = parsed_json["scorecard_name"]
	scorecard = None

	if "share_id" in parsed_json:
		#save existing
		scorecard = Scorecard.objects.filter(share_id=parsed_json["share_id"]).first()

		if scorecard.user_email != request.session['bscapp_profile']['email'] and Shares.objects.filter(scorecard=scorecard,shared_with=request.session['bscapp_profile']['email']).count() == 0:
			# the user does not own the bsc and user has no rights in Shares table
			return HttpResponse("You do not have correct permissions to edit this Balanced Scorecard", status=403)
	else:
		share_id_instance = hashlib.sha1(scorecard_name + request.session['bscapp_profile']['email']).hexdigest()

		if(Scorecard.objects.filter(share_id=share_id_instance).count() == 0):
			parsed_json["share_id"] = share_id_instance;
			scorecard_instance = Scorecard.objects.create(user_email=request.session['bscapp_profile']['email'],scorecard_name=scorecard_name,share_id=share_id_instance, share_permissions=0)
			scorecard_instance.save()
			scorecard = scorecard_instance
		else:
			print "ERROR SCORECARD ALREADY EXISTS"
			return HttpResponse("A scorecard with that name already exists", status=403)

	#table index:
	#0 = learngrow
	#1 = customer
	#2 = business
	#3 = financial

	#tablerow.objects.filter(scorecard=scorecard).delete()

	#for each existing record not in the json, delete that record
	for row in tablerow.objects.filter(scorecard=scorecard):
		if(row.table == 0):
			if (not any(str(row.id) == j["rowid"] for j in  parsed_json["tables"]["learngrowtable"]["rows"])):
				row.archived = True;
				row.save()
		elif (row.table == 1):
			if (not any(str(row.id) == j["rowid"] for j in parsed_json["tables"]["customertable"]["rows"])):
				row.archived = True;
				row.save()
		elif (row.table == 2):
			if (not any(str(row.id) == j["rowid"] for j in parsed_json["tables"]["businesstable"]["rows"])):
				row.archived = True;
				row.save()
		elif (row.table == 3):
			if (not any(str(row.id) == j["rowid"] for j in parsed_json["tables"]["financialtable"]["rows"])):
				row.archived = True;
				row.save()

	#for each existing record whose value has changed, update
	#for each new record, create

	for row in parsed_json["tables"]["learngrowtable"]["rows"]:
		if (any((row["rowid"] == str(j.id)) for j in tablerow.objects.filter(scorecard=scorecard,table=0,archived=False))):
			tablerow_instance = tablerow.objects.filter(scorecard=scorecard, table=0,pk=row["rowid"],archived=False).first()

			if row["actual"] != tablerow_instance.actual:
				observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
				observation_instance.save()

			tablerow_instance.year = row["year"]
			tablerow_instance.name = row["name"]
			tablerow_instance.measure = row["measure"]
			tablerow_instance.target = row["target"]
			tablerow_instance.actual = row["actual"]
			tablerow_instance.plan_of_action = row["poa"]
			tablerow_instance.save()
		elif (not any(row["rowid"] == str(j.id) for j in tablerow.objects.filter(scorecard=scorecard,table=0,archived=False))):

			tablerow_instance = tablerow.objects.create(scorecard=scorecard, table=0, year=row["year"], name=row["name"],
														measure=row["measure"], target=row["target"], actual=row["actual"],
														plan_of_action=row["poa"],archived=False)
			tablerow_instance.save()

			observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
			observation_instance.save()

	for row in parsed_json["tables"]["customertable"]["rows"]:
		if (any((row["rowid"] == j.id) for j in tablerow.objects.filter(scorecard=scorecard,table=1,archived=False))):
			tablerow_instance = tablerow.objects.filter(scorecard=scorecard, table=1,pk=row["rowid"],archived=False).first()

			if row["actual"] != tablerow_instance.actual:
				observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
				observation_instance.save()

			tablerow_instance.actual = row["actual"]
			tablerow_instance.save()
		elif (not any(row["rowid"] == j.id for j in tablerow.objects.filter(scorecard=scorecard,table=1,archived=False))):
			tablerow_instance = tablerow.objects.create(scorecard=scorecard, table=1, year=row["year"], name=row["name"],
														measure=row["measure"], target=row["target"], actual=row["actual"],
														plan_of_action=row["poa"])
			tablerow_instance.save()

			observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
			observation_instance.save()

	for row in parsed_json["tables"]["businesstable"]["rows"]:
		if (any((row["rowid"] == j.id) for j in tablerow.objects.filter(scorecard=scorecard,table=2,archived=False))):
			tablerow_instance = tablerow.objects.filter(scorecard=scorecard, table=2, pk=row["rowid"],archived=False).first()

			if row["actual"] != tablerow_instance.actual:
				observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
				observation_instance.save()

			tablerow_instance.actual = row["actual"]
			tablerow_instance.save()
		elif (not any(row["rowid"] == j.id for j in tablerow.objects.filter(scorecard=scorecard,table=2,archived=False))):
			tablerow_instance = tablerow.objects.create(scorecard=scorecard, table=2, year=row["year"], name=row["name"],
														measure=row["measure"], target=row["target"], actual=row["actual"],
														plan_of_action=row["poa"])
			tablerow_instance.save()

			observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
			observation_instance.save()

	for row in parsed_json["tables"]["financialtable"]["rows"]:
		if (any((row["rowid"] == j.id) for j in tablerow.objects.filter(scorecard=scorecard,table=3,archived=False))):
			tablerow_instance = tablerow.objects.filter(scorecard=scorecard, table=3, pk=row["rowid"],archived=False).first()

			if row["actual"] != tablerow_instance.actual:
				observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
				observation_instance.save()

			tablerow_instance.actual = row["actual"]
			tablerow_instance.save()
		elif (not any(row["rowid"] == j.id for j in tablerow.objects.filter(scorecard=scorecard,table=3,archived=False))):
			tablerow_instance = tablerow.objects.create(scorecard=scorecard, table=3, year=row["year"], name=row["name"],
														measure=row["measure"], target=row["target"], actual=row["actual"],
														plan_of_action=row["poa"])
			tablerow_instance.save()

			observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
			observation_instance.save()
        
	#return redirect('index')
	return HttpResponse(json.dumps(parsed_json))

#delete table
def delete_tables(request):
	text_json = request.POST['tablejson']
	parsed_json = json.loads(text_json)
	scorecard = None

	if "share_id" in parsed_json:
		# save existing
		scorecard = Scorecard.objects.filter(share_id=parsed_json["share_id"]).first()
		if scorecard.user_email == request.session['bscapp_profile']['email']:
			scorecard.delete()
		else:
			return HttpResponse("You do not own this scorecard", status=403)
	else:
		return HttpResponse("Error deleting scorecard", status=404)

	return HttpResponse("Success", status=200)


def load_tables(request):
	scorecard = ""
	scorecard_name = ""
	share_id = ""

	if "scorecard_name" in request.POST:
		scorecard_name = request.POST["scorecard_name"]
		if Scorecard.objects.filter(scorecard_name=scorecard_name,user_email=request.session['bscapp_profile']['email']).count() > 0:
			scorecard = Scorecard.objects.filter(scorecard_name=scorecard_name, user_email=request.session['bscapp_profile']['email']).first()
			share_id = scorecard.share_id
		else:
			return HttpResponse('You do not own a SWT Analysis with that name' + str(Scorecard.objects.filter(scorecard_name=scorecard_name,user_email=request.session['bscapp_profile']['email']).count()), status=404)
	elif 'scorecard_share_id' in request.POST:
		scorecard = Scorecard.objects.filter(share_id=request.POST["scorecard_share_id"]).first()
		share_id = request.POST["scorecard_share_id"]
		scorecard_name = scorecard.scorecard_name

	#scorecard_name = request.POST["scorecard_name"]
	#scorecard = Scorecard.objects.filter(scorecard_name=scorecard_name)
	rows = tablerow.objects.filter(scorecard=scorecard,archived=False)
	learngrow = '"learngrowtable": { "rows": ['
	business = '"businesstable": { "rows": ['
	customer = '"customertable": { "rows": ['
	financial = '"financialtable": { "rows": ['

	for r in rows:
		if r.table == 0:
			learngrow += '{"year": "' + str(r.year) + '", "name": "' + r.name + '", "measure": "' + r.measure + '", "target": "' + r.target + '", "actual": "' + r.actual + '", "poa": "' + r.plan_of_action + '", "rowid": "' + str(r.id) + '"},'
		elif r.table == 1:
			customer += '{"year": "' + str(r.year) + '", "name": "' + r.name + '", "measure": "' + r.measure + '", "target": "' + r.target + '", "actual": "' + r.actual + '", "poa": "' + r.plan_of_action + '", "rowid": "' + str(r.id) + '"},'
		elif r.table == 2:
			business += '{"year": "' + str(r.year) + '", "name": "' + r.name + '", "measure": "' + r.measure + '", "target": "' + r.target + '", "actual": "' + r.actual + '", "poa": "' + r.plan_of_action + '", "rowid": "' + str(r.id) + '"},'
		elif r.table == 3:
			financial += '{"year": "' + str(r.year) + '", "name": "' + r.name + '", "measure": "' + r.measure + '", "target": "' + r.target + '", "actual": "' + r.actual + '", "poa": "' + r.plan_of_action + '", "rowid": "' + str(r.id) + '"},'

	if learngrow.endswith(","):
		learngrow = learngrow[:len(learngrow)-1]
	if business.endswith(","):
		business = business[:len(business)-1]
	if customer.endswith(","):
		customer = customer[:len(customer)-1]
	if financial.endswith(","):
		financial = financial[:len(financial)-1]

	learngrow += "]},"
	business += "]},"
	customer += "]},"
	financial += "]}"

	json = '{"scorecard_name": "'+scorecard_name + '", "share_id": "' + share_id + '", "tables":{'+ learngrow + business + customer + financial +'}}'

	return HttpResponse(json)

def get_scorecard_for_user(request):
	user = request.session['bscapp_profile']['email']
	scorecards = Scorecard.objects.filter(user_email=user)
	owned = ''
	shared = ''

	for sc in scorecards:
		owned += '{"scorecard_name": "' + sc.scorecard_name + '"},'

	if owned.endswith(","):
		owned = owned[:len(owned) - 1]

	shares = Shares.objects.filter(shared_with=user)
	for sc in shares:
		scorecard = sc.scorecard
		shared += '{"scorecard_name": "' + scorecard.scorecard_name + '", "share_id": "' + scorecard.share_id + '"},'

	if shared.endswith(","):
		shared = shared[:len(shared) - 1]

	scorecards_json = '{"scorecards": {"owned":[' + owned + '],"shared": [' + shared + ']}}'

	'''
	scorecards = Scorecard.objects.filter(user_email=request.session['bscapp_profile']['email'])
	scorecards_json = '{"scorecards":['

	for sc in scorecards:
		scorecards_json += '{"scorecard_name": "'+ sc.scorecard_name +'"},'

	if scorecards_json.endswith(","):
		scorecards_json = scorecards_json[:len(scorecards_json)-1]

	scorecards_json += ']}'
	'''
	return HttpResponse(scorecards_json)


def download_data(request):
	json_string = request.POST['tablejson']
	response = FileResponse(json_string, content_type='application/json')
	response['Content-Disposition'] = 'attachment; filename='+request.POST['filename']
	print 'in download data'
	return response

def export_to_pdf(request):
	#FOR LINUX
	pdf = HTML(string=request.POST['html_string']).write_pdf(stylesheets=[CSS(filename="/home/django/balancedscorecard/bscapp/static/css/bsc.css"), CSS(filename="/home/django/balancedscorecard/bscapp/static/css/layout.css")])
	return FileResponse(pdf, content_type='application/pdf')

	#FOR WINDOWS
	'''html_string = request.POST['html_string']
	config = pdfkit.configuration(wkhtmltopdf='C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe')
	css = [
		'C:\\Users\\Joel Potts\\PycharmProjects\\onlines3_django\\bscapp\\static\\css\\bsc.css',
		'C:\\Users\\Joel Potts\\PycharmProjects\\onlines3_django\\cvbapp\\static\\css\\layout.css',
	]
	pdf = pdfkit.from_string(html_string, False, configuration=config, css=css)
	response = FileResponse(pdf, content_type='application/pdf')
	response['Content-Disposition'] = 'attachment; filename=balanced_scorecard.pdf'
	return response'''

def callback(request):
	code = request.GET['code']
	get_token = GetToken('onlines3.eu.auth0.com')
	auth0_users = Users('onlines3.eu.auth0.com')
	token = get_token.authorization_code(client_id, client_secret, code, 'http://li1088-54.members.linode.com:8082/bscapp/callback/')
	user_info = auth0_users.userinfo(token['access_token'])
	request.session['bscapp_profile'] = json.loads(user_info)
	#save user to db and session
	return redirect('bscapp_index')

def logout(request):
	request.session['bscapp_profile'] = None
	#parsed_base_url = urlparse('http://li1088-54.members.linode.com:8082/bscapp/callback/')
	#base_url = parsed_base_url.scheme + '://' + parsed_base_url.netloc
	#return redirect('https://%s/v2/logout?returnTo=%s&client_id=%s' % ('onlines3.eu.auth0.com', base_url, 'vE0hJ4Gx1uYG9LBtuxgqY7CTIFmKivFH'))
	return redirect('bscapp_index')

def add_scorecard_to_shares(request):
	if Scorecard.objects.filter(share_id=request.POST["scorecard_share_id"], user_email=request.session['bscapp_profile']['email']).count() == 0:
		scorecard = Scorecard.objects.filter(share_id=request.POST["scorecard_share_id"]).first()
		shared_with = request.session['bscapp_profile']['email']
		if Shares.objects.filter(scorecard=scorecard, shared_with=shared_with).count() == 0:
			shares_instance = Shares.objects.create(scorecard=scorecard, shared_with=shared_with)
			shares_instance.save()

	return HttpResponse('OK');

def listObservations(request):
	rowid = request.GET['rowid']
	observations = '{"observations":['
	for obs in Observation.objects.filter(tablerow=tablerow.objects.filter(pk=rowid).first()):
		observations += '{"value": "' + obs.value + '", "timestamp": "' + str(obs.timestamp) + '"},'

	if observations.endswith(","):
		observations = observations[:len(observations)-1]

	observations += ']}'

	return HttpResponse(observations)
