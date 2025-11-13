<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CardContent } from "$lib/components/ui/card"
</script>

<CardContent class="p-6 md:p-8 flex flex-col gap-6 items-center text-center">
	<h1 class="text-2xl font-bold">Toegang alleen op uitnodiging</h1>

	<div>
		<p>
			Het account waarmee u probeert in te loggen bestaat niet of is niet geactiveerd.
		</p>
		<p>Neem contact op met de systeembeheerder om een uitnodiging te ontvangen.</p>
	</div>

	<Button href="/auth/login" variant="outline">Opnieuw inloggen</Button>
</CardContent>
