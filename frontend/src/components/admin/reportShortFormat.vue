<template>
	<div class="column">
		<div class="row">
			<report-id class="report-id" :report-id="report.reportId"/>
			<report-solved-indicator :solved="report.fixed"/>
			<report-urgent-icon  :is-urgent="report.urgent"/>
			<report-message-icon :has-message="report.hasAdminComment"/>
		</div>
		<report-date class="report-date" :report-date="report.timestamp"/>
	</div>
</template>

<style lang="sass" scoped>
	.column
		display: flex
		flex-direction: column
		.report-date
			align-self: flex-end
		.row
			display: flex
			flex-direction: row
			& > *:not(:last-child)
				padding-right: 10px
			.report-id
				flex-grow: 1
				font-size: 16pt



</style>

<script>
	import {
		ReportId,
		ReportDate,
		ReportMessageIcon,
		ReportUrgentIcon,
		ReportSolvedIndicator
	} from '@/components/_common/report'

	export default {
		components: {
			ReportId,
			ReportDate,
			ReportMessageIcon,
			ReportUrgentIcon,
			ReportSolvedIndicator,
		},
		props: {
			report: Object,
		},
	}
</script>
