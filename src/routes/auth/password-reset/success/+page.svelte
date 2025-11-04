<script lang="ts">
	import { CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
</script>

<CardContent class="p-6 md:p-8 flex flex-col gap-6 items-center text-center">
	<h1 class="text-2xl font-bold">Je nieuwe wachtwoord is ingesteld</h1>

	<div>
		<p>Je wachtwoord is succesvol gewijzigd. Je kunt nu inloggen met je nieuwe wachtwoord.</p>
	</div>

	<Button href="/auth/login">Inloggen</Button>
</CardContent>
