<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  let { data } = $props()
</script>

<p>Ingelogd als {data.session?.user.email}</p>

<form action="/auth/logout" method="GET">
  <Button type="submit">Uitloggen</Button>
</form>
