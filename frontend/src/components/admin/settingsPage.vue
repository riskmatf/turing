<template>
	<div>
		<page-header>
			<breadcrumbs :paths="breadcrumbData" class="breadcrumbs"/>
		</page-header>
		<div class="location-container">
			<el-card class="content-container">
				<el-collapse>
					<el-collapse-item title="Promena imena">
						<div class="collapse-container">
							<div class="marginer">Unesite novo ime:</div>
							<el-input
								placeholder="Novo ime"
								size="mini"
								class="input"
								v-model="nameInput"
								:maxlength="20"
								show-word-limit
								@keyup.native.enter="handleChangeName"
							/>
							<el-button
									size="mini"
									class="styler"
									@click="handleChangeName"
									:disabled="isChangedNameButtonDisabled"
							>
								Promeni ime
							</el-button>
						</div>
					</el-collapse-item>
					<el-collapse-item title="Promena lozinke">
						<div class="collapse-container" autocomplete="off">
							<div class="marginer">Unesite staru lozinku:</div>
							<form autocomplete="off" @submit="preventSubmit">
								<el-input
										placeholder="Stara lozinka"
										size="mini"
										class="input"
										v-model="oldPassword"
										show-password
										@keyup.native.enter="handleChangePassword"
								/>
							</form>
							<div class="marginer">Unesite novu lozinku:</div>
							<form autocomplete="off" @submit="preventSubmit">
								<el-input
										placeholder="Nova lozinka"
										size="mini"
										class="input"
										v-model="passInput"
										show-password
										@keyup.native.enter="handleChangePassword"
								/>
							</form>
							<div class="marginer">Potvrdite novu lozinku:</div>
							<form autocomplete="off" @submit="preventSubmit">
								<el-input
										placeholder="Potvrda lozinke"
										size="mini"
										class="input"
										v-model="repeatInput"
										show-password
										@keyup.native.enter="handleChangePassword"
								/>
							</form>
							<el-button
									size="mini"
									class="styler"
									@click="handleChangePassword"
									:disabled="isChangedPasswordButtonDisabled"
							>
								Promeni lozinku
							</el-button>
						</div>
					</el-collapse-item>
				</el-collapse>
			</el-card>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	.breadcrumbs
		margin-top: 5px
		margin-bottom: 5px
		margin-left: 2px
	.location-container
		display: flex
		flex-direction: column
		align-items: center
		margin-top: 5px
		.content-container
			width: 90%
			.collapse-container
				display: flex
				flex-direction: column
				width: 90%
				margin: auto
			.styler
				margin-top: 10px
				align-self: flex-end
			.marginer
				margin-top: 2px
				margin-bottom: 2px
	.loading
		margin: 20px
</style>

<script>
	import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
	import PageHeader from '@/components/_common/pageHeader'
	import { mapActions } from 'vuex'


	export default {
		components: {
			Breadcrumbs,
			PageHeader,
		},
		computed: {
			breadcrumbData() {
				return [
						{ name: 'početna', to: {name: 'adminHomePage'}},
						{ name: 'podešavanja', to: { name: 'adminClassroomListPage' } }
				]
			},
			isChangedNameButtonDisabled() {
				return this.changeNameRequestInProgress || this.nameInput.trim().length === 0
			},
			isChangedPasswordButtonDisabled() {
				return this.changePasswordRequestInProgress ||
					this.passInput.trim().length === 0 ||
					this.repeatInput.trim().length === 0 ||
					this.oldPassword.trim().length === 0
			},
		},
		data() {
			return {
				nameInput: '',
				oldPassword: '',
				passInput: '',
				repeatInput: '',
				changeNameRequestInProgress: false,
				changePasswordRequestInProgress: false,
			}
		},
		methods: {
			...mapActions('Admin/Admin', ['changeName', 'changePassword']),
			handleChangeName() {
				if(this.isChangedNameButtonDisabled) {
					return
				}
				this.changeNameRequestInProgress = true
				this.changeName({ displayName: this.nameInput })
				.then(()=> {
					this.$message({
						type: 'success',
						message: 'Ime je uspešno promenjeno.'
					})
					this.$emit('change')
				}).catch(()=>{
					this.$message({
						type: 'error',
						message: `Promena imena neuspešna.`,
					})
				}).finally(()=>{
						this.changeNameRequestInProgress = false
					}
				)
			},
			handleChangePassword() {
				if(this.isChangedPasswordButtonDisabled) {
					return
				}
				if (this.passInput === this.repeatInput){
					this.changePasswordRequestInProgress = true

					this.$confirm('Da li želite da promenite lozinku?', {
							cancelButtonText: 'Otkaži',
							confirmButtonText: 'Promeni',
							customClass: 'message-box-reversed',
							center: true
						}
					).then(()=> {
						this.changePassword({ password: this.passInput, oldPassword: this.oldPassword })
						.then(()=> {
							this.$message({
								type: 'success',
								message: 'Lozinka je uspešno promenjena.'
							})
							this.$emit('change')
						}).catch(()=>{
							this.$message({
								type: 'error',
								message: `Promena lozinke neuspešna.`,
							})
						})
					}).finally(()=> {
						this.changePasswordRequestInProgress = false
					})


				} else {
					this.$message({
						type: 'error',
						message: `Lozinke se ne poklapaju.`,
					})
				}
			},
			preventSubmit(e) {
				e.preventDefault()
			},
		},
	}
</script>
